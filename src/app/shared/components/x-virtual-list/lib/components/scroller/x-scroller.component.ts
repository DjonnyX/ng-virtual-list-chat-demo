import { Component, DestroyRef, ElementRef, inject, input, OnDestroy, signal, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, fromEvent, map, of, race, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ScrollerDirection } from './enums';
import { ScrollBox } from './utils';
import { ScrollerDirections } from './enums';
import { Id, ISize } from '../../types';
import { Easing } from './types';
import { easeLinear, easeOutQuad } from './utils/ease';

const TOP = 'top',
  LEFT = 'left',
  INSTANT = 'instant',
  AUTO = 'auto',
  SMOOTH = 'smooth',
  VERTICAL = 'vertical',
  DURATION = 2000,
  FRICTION_FORCE = 0.035,
  MAX_DURATION = 4000,
  MASS = 0.005,
  MAX_DIST = 15000,
  MIN_TIMESTAMP = 20,
  MAX_VELOCITY_TIMESTAMP = 100,
  SPEED_SCALE = 5;

const calculateDirection = (buffer: Array<[number, number]>) => {
  for (let i = buffer.length - 1, l = 0; i >= l; i--) {
    const v = buffer[i];
    if (v[0] === 0) {
      continue;
    }
    return Math.sign(v[0]);
  }
  return 1;
}

export interface IScrollToParams {
  x?: number;
  y?: number;
  left?: number;
  top?: number;
  blending?: boolean;
  behavior?: ScrollBehavior;
}

const SCROLL_EVENT = new Event('scroll');

/**
 * The scroller for the XVirtualList item component
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-scroller',
  imports: [CommonModule, CdkScrollable],
  templateUrl: './x-scroller.component.html',
  styleUrl: './x-scroller.component.scss'
})
export class XScrollerComponent implements OnDestroy {
  scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

  @ViewChild('scrollViewport', { read: CdkScrollable })
  cdkScrollable: CdkScrollable | undefined;

  scrollViewport = viewChild<ElementRef<HTMLDivElement>>('scrollViewport');

  direction = input<ScrollerDirections>(ScrollerDirection.VERTICAL);

  focusedElement = input<Id | undefined>(undefined);

  content = input<HTMLElement>();

  classes = input<{ [cName: string]: boolean }>({});

  scrollStartOffset = input<number>(0);

  scrollEndOffset = input<number>(0);

  private _$scroll = new Subject<void>();
  readonly $scroll = this._$scroll.asObservable();

  private _$scrollEnd = new Subject<void>();
  readonly $scrollEnd = this._$scrollEnd.asObservable();

  private _scrollBox = new ScrollBox();

  get host() {
    return this.scrollViewport()?.nativeElement;
  }

  private _destroyRef = inject(DestroyRef);

  private _isMoving = false;

  private _scrollLeftPersent = 0;

  private _scrollTopPersent = 0;

  private _x: number = 0;
  set x(v: number) {
    this._x = v;
    this._scrollLeftPersent = v !== 0 ? this.scrollWidth / v : 0;
  }
  get x() { return this._x; }

  private _y: number = 0;
  set y(v: number) {
    this._y = v;
    this._scrollTopPersent = v !== 0 ? this.scrollHeight / v : 0;
  }
  get y() { return this._y; }

  private _animationCanceler: Function | undefined;

  private _totalSize: number = 0;
  set totalSize(v: number) {
    this._totalSize = v;
  }

  private _actualScrollSize: number = 0;
  set actualScrollSize(v: number) {
    this._actualScrollSize = v;
  }

  get scrollLeft() {
    return this._x;
  }

  get scrollTop() {
    return this._y;
  }

  get scrollWidth() {
    const { width: viewportWidth } = this.viewportBounds(),
      { width: contentWidth } = this.contentBounds();
    return contentWidth < viewportWidth ? 0 : (contentWidth - viewportWidth);
  }

  get scrollHeight() {
    const { height: viewportHeight } = this.viewportBounds(),
      { height: contentHeight } = this.contentBounds();
    return contentHeight < viewportHeight ? 0 : (contentHeight - (viewportHeight - this.scrollEndOffset()));
  }

  private _velocity: number = 0;

  readonly viewportBounds = signal<ISize>({ width: 0, height: 0 });

  readonly contentBounds = signal<ISize>({ width: 0, height: 0 });

  private _viewportResizeObserver: ResizeObserver;

  private _onResizeViewportHandler = () => {
    const viewport = this.scrollViewport()?.nativeElement;
    if (viewport) {
      this.viewportBounds.set({ width: viewport.offsetWidth, height: viewport.offsetHeight });
    }
  }

  private _contentResizeObserver: ResizeObserver;

  private _onResizeContentHandler = () => {
    const content = this.scrollContent()?.nativeElement;
    if (content) {
      this.contentBounds.set({ width: content.offsetWidth, height: content.offsetHeight });
    }
  }

  constructor() {
    this._viewportResizeObserver = new ResizeObserver(this._onResizeViewportHandler);
    this._contentResizeObserver = new ResizeObserver(this._onResizeContentHandler);

    const $viewport = toObservable(this.scrollViewport).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    ),
      $content = toObservable(this.scrollContent).pipe(
        takeUntilDestroyed(),
        filter(v => !!v),
        map(v => v.nativeElement),
      );

    $viewport.pipe(
      takeUntilDestroyed(),
      tap(viewport => {
        this._viewportResizeObserver.observe(viewport);
        this._onResizeViewportHandler();
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(),
      tap(content => {
        this._contentResizeObserver.observe(content);
        this._onResizeContentHandler();
      }),
    ).subscribe();

    const isVertical = this.direction() === VERTICAL;

    $content.pipe(
      takeUntilDestroyed(),
      switchMap(content => {
        return fromEvent<WheelEvent>(content, 'wheel', { passive: true }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            const scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
              startPos = isVertical ? this.y : this.x,
              delta = isVertical ? e.deltaY : e.deltaX, dp = startPos + delta, position = dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp;
            this.scrollTo({ [isVertical ? TOP : LEFT]: position, behavior: INSTANT });
          }),
        );
      }),
    ).subscribe();

    const $mouseUp = fromEvent<MouseEvent>(window, 'mouseup', { passive: true }).pipe(
      takeUntilDestroyed(),
    ),
      $mouseLeave = fromEvent<MouseEvent>(window, 'mouseleave', { passive: true }).pipe(
        takeUntilDestroyed(),
      ),
      $mouseDragCancel = race([$mouseUp, $mouseLeave]).pipe(
        takeUntilDestroyed(),
        delay(0),
        tap(() => {
          this._isMoving = false;
        }),
      );

    $content.pipe(
      takeUntilDestroyed(),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, 'mousedown', { passive: true }).pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(e => {
            this.stopScrolling();
            const target = e.target as HTMLElement;
            if (target.classList.contains('interactive')) {
              return of(undefined);
            }
            this._isMoving = true;
            const startPos = isVertical ? this.y : this.x;
            let prevPos = startPos, prevClientPosition = 0, startPosDelta = 0;
            const startClientPos = isVertical ? e.clientY : e.clientX,
              offsets = new Array<[number, number]>(), velocities = new Array<[number, number]>();
            let startTime = performance.now();
            return fromEvent<MouseEvent>(window, 'mousemove', { passive: false }).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($mouseDragCancel),
              switchMap(e => {
                e.preventDefault();
                const cPos = isVertical ? this.y : this.x;
                if (cPos !== prevPos) {
                  startPosDelta += cPos - prevPos;
                }
                const currentPos = isVertical ? e.clientY : e.clientX,
                  scrollSize = isVertical ? this.scrollHeight : this.scrollWidth, delta = startClientPos - currentPos,
                  dp = startPos + startPosDelta + delta, position = Math.round(dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp), endTime = performance.now(),
                  timestamp = endTime - startTime, scrollDelta = prevClientPosition === 0 ? 0 : prevClientPosition - currentPos,
                  { v0 } = this.calculateVelocity(offsets, scrollDelta, timestamp);
                this.calculateAcceleration(velocities, v0, timestamp);
                prevClientPosition = currentPos;
                prevPos = position;
                this.move(isVertical, position);
                startTime = endTime;
                return fromEvent(window, 'mouseup').pipe(
                  takeUntilDestroyed(this._destroyRef),
                  tap(e => {
                    const endTime = performance.now(),
                      timestamp = endTime - startTime,
                      { v0 } = this.calculateVelocity(offsets, scrollDelta, timestamp),
                      { a0 } = this.calculateAcceleration(velocities, v0, timestamp);
                    this.moveWithAcceleration(isVertical, position, 0, v0, a0);
                    this._isMoving = false;
                  }),
                );
              }),
            );
          })
        );
      }),
    ).subscribe();

    const $touchUp = fromEvent<TouchEvent>(window, 'touchend', { passive: true }).pipe(
      takeUntilDestroyed(),
    ),
      $touchCanceler = $touchUp.pipe(
        takeUntilDestroyed(this._destroyRef),
        delay(0),
        tap(() => {
          this._isMoving = false;
        }),
      );

    $content.pipe(
      takeUntilDestroyed(),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, 'touchstart', { passive: true }).pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(e => {
            this.stopScrolling();
            const target = e.target as HTMLElement;
            if (target.classList.contains('interactive')) {
              return of(undefined);
            }
            this._isMoving = true;
            const startPos = isVertical ? this.y : this.x;
            let prevPos = startPos, prevClientPosition = 0, startPosDelta = 0;
            const startClientPos = isVertical ? e.touches[e.touches.length - 1].clientY : e.touches[e.touches.length - 1].clientX,
              offsets = new Array<[number, number]>(), velocities = new Array<[number, number]>();
            let startTime = performance.now();
            return fromEvent<TouchEvent>(window, 'touchmove', { passive: false }).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($touchCanceler),
              switchMap(e => {
                e.preventDefault();
                const cPos = isVertical ? this.y : this.x;
                if (cPos !== prevPos) {
                  startPosDelta += cPos - prevPos;
                }
                const currentPos = isVertical ? e.touches[e.touches.length - 1].clientY : e.touches[e.touches.length - 1].clientX,
                  scrollSize = isVertical ? this.scrollHeight : this.scrollWidth, delta = startClientPos - currentPos,
                  dp = startPos + startPosDelta + delta, position = Math.round(dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp), endTime = performance.now(),
                  timestamp = endTime - startTime, scrollDelta = prevClientPosition === 0 ? 0 : prevClientPosition - currentPos,
                  { v0 } = this.calculateVelocity(offsets, scrollDelta, timestamp);
                this.calculateAcceleration(velocities, v0, timestamp);
                prevClientPosition = currentPos;
                prevPos = position;
                this.move(isVertical, position);
                startTime = endTime;
                return fromEvent(window, 'touchend').pipe(
                  takeUntilDestroyed(this._destroyRef),
                  tap(e => {
                    const endTime = performance.now(),
                      timestamp = endTime - startTime,
                      { v0 } = this.calculateVelocity(offsets, scrollDelta, timestamp),
                      { a0 } = this.calculateAcceleration(velocities, v0, timestamp);
                    this.moveWithAcceleration(isVertical, position, this._velocity, v0, a0);
                    this._isMoving = false;
                  }),
                );
              }),
            );
          })
        );
      }),
    ).subscribe();
  }

  private calculateVelocity(offsets: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
    offsets.push([delta, timestamp < MIN_TIMESTAMP ? MIN_TIMESTAMP : timestamp]);

    const len = offsets.length, startIndex = len > indexOffset ? len - indexOffset : 0, lastVSign = calculateDirection(offsets);
    let vSum = 0;
    for (let i = startIndex, l = offsets.length; i < l; i++) {
      const p0 = offsets[i];
      if (lastVSign !== Math.sign(p0[0])) {
        continue;
      }

      const v0 = (p0[1] !== 0 ? lastVSign * Math.abs(p0[0] / p0[1]) * SPEED_SCALE : 0);
      vSum += Math.sign(v0) * Math.pow(v0, 4) * .003;
    }

    const l = Math.min(offsets.length, indexOffset), v0 = l > 0 ? (vSum / l) : 0;
    return { v0 };
  }

  private calculateAcceleration(velocities: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
    velocities.push([delta, timestamp < MIN_TIMESTAMP ? MIN_TIMESTAMP : timestamp]);
    const len = velocities.length, startIndex = len > indexOffset ? len - indexOffset : 0;
    let aSum = 0, prevV0: [number, number] | undefined, iteration = 0, lastVSign = calculateDirection(velocities);
    for (let i = startIndex, l = velocities.length; i < l; i++) {
      const v00 = prevV0, v01 = velocities[i];
      if (lastVSign !== Math.sign(v01[0])) {
        continue;
      }
      if (v00) {
        const a0 = timestamp < MAX_VELOCITY_TIMESTAMP ? ((lastVSign * Math.abs(Math.abs(v01[0]) - Math.abs(v00[0]))) / Math.abs(v00[1])) : 0;
        aSum += a0;
        prevV0 = v01;
      }
      prevV0 = v01;
      iteration++;
    }

    const a0 = aSum * FRICTION_FORCE;
    return { a0 };
  }

  stopScrolling() {
    if (this._animationCanceler !== undefined) {
      this._animationCanceler();
    }
  }

  private move(isVertical: boolean, position: number, blending: boolean = false) {
    this.scrollTo({ [isVertical ? TOP : LEFT]: position, behavior: INSTANT, blending });
  }

  private moveWithAcceleration(isVertical: boolean, position: number, v0: number, v: number, a0: number) {
    if (a0 !== 0) {
      const dvSign = Math.sign(v), v00 = Math.sign(v0) !== dvSign ? 0 : v0,
        dv = (dvSign * Math.abs(Math.abs(v) - Math.abs(v00))),
        duration = DURATION, maxDuration = MAX_DURATION,
        maxDistance = dvSign * MAX_DIST, s = (dvSign * Math.abs((a0 * Math.pow(duration, 2)) * .5) / 1000) / MASS,
        distance = Math.abs(s) < MAX_DIST ? s : maxDistance, positionWithVelocity = position + distance,
        ad = Math.abs(Math.sqrt(Math.max(Math.abs(v0), Math.abs(v)))) * 10 / MASS,
        aDuration = ad < maxDuration ? ad : maxDuration,
        startPosition = isVertical ? this.y : this.x;
      this.animate(startPosition, Math.round(positionWithVelocity), aDuration, easeOutQuad);
    }
  }

  animate(startValue: number, endValue: number, duration = 500, easingFunction: Easing = easeLinear) {
    if (this._animationCanceler !== undefined) {
      this._animationCanceler();
    }
    const startTime = performance.now(), isVertical = this.direction() === ScrollerDirection.VERTICAL;
    let isCanceled = false, prevPos = startValue, startPosDelta = 0, delta = 0, prevTime = performance.now();

    if (isVertical) {
      this.y = startValue;
    } else {
      this.x = startValue;
    }

    const step = (currentTime: number) => {
      if (!!isCanceled) {
        return;
      }

      const cPos = isVertical ? this.y : this.x;
      let scrollDelta = 0;
      if (cPos !== prevPos) {
        scrollDelta = cPos - prevPos;
        startPosDelta += scrollDelta;
      }

      const elapsed = currentTime - startTime,
        progress = Math.min(elapsed / duration, 1),
        easedProgress = easingFunction(progress),
        val = Math.round(startPosDelta + startValue + (endValue - startValue) * easedProgress),
        scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
        currentValue = val < 0 ? 0 : val > scrollSize ? scrollSize : val,
        t = performance.now(),
        isFinished = currentValue === endValue || ((currentValue === (scrollSize - this.scrollStartOffset() - this.scrollEndOffset())) || (currentValue === 0));

      delta = currentValue - scrollDelta - prevPos;

      const ts = t - prevTime, timestamp = ts < MIN_TIMESTAMP ? MIN_TIMESTAMP : ts;
      this._velocity = delta / timestamp;

      prevTime = t;
      prevPos = currentValue;

      const scrollContent = this.scrollContent()?.nativeElement as HTMLDivElement;
      if (scrollContent) {
        if (isVertical) {
          this.y = currentValue;
          scrollContent.style.transform = `translate3d(0, ${-currentValue}px, 0)`;
          if (this.cdkScrollable) {
            this.cdkScrollable.getElementRef().nativeElement.dispatchEvent(SCROLL_EVENT);
          }
          this._$scroll.next();
        } else {
          this.x = currentValue;
          scrollContent.style.transform = `translate3d(${-currentValue}px, 0, 0)`;
          if (this.cdkScrollable) {
            this.cdkScrollable.getElementRef().nativeElement.dispatchEvent(SCROLL_EVENT);
          }
          this._$scroll.next();
        }
      }

      if (!isFinished && progress < 1) {
        requestAnimationFrame(step);
      } else {
        this._$scrollEnd.next();
      }
    }, canceler = () => {
      isCanceled = true;
    };

    requestAnimationFrame(step);

    this._animationCanceler = canceler;
  }

  scrollTo(params: IScrollToParams) {
    const posX = params.x || params.left || 0,
      posY = params.y || params.top || 0,
      behavior = params.behavior ?? INSTANT,
      blending = params.blending ?? true,
      direction = this.direction(),
      scrollContent = this.scrollContent()?.nativeElement as HTMLDivElement,
      scrollViewport = this.scrollViewport()?.nativeElement as HTMLDivElement,
      isVertical = this.direction() === ScrollerDirection.VERTICAL;

    const {
      x,
      y,
    } = this._scrollBox.calculateScroll({
      direction,
      viewportWidth: scrollViewport.offsetWidth, viewportHeight: scrollViewport.offsetHeight,
      contentWidth: scrollContent.offsetWidth, contentHeight: scrollContent.offsetHeight,
      positionX: posX, positionY: posY,
    });

    if (this._isMoving) {
      if (isVertical) {
        if (y < 0 || y > this._totalSize - this.viewportBounds().height) {
          return;
        }
      } else {
        if (x < 0 || x > this._totalSize - this.viewportBounds().width) {
          return;
        }
      }
    }

    const xx = Math.round(x < 0 ? 0 : x > this.scrollWidth ? this.scrollWidth : x),
      yy = Math.round(y < 0 ? 0 : y > this.scrollHeight ? this.scrollHeight : y),
      prevX = this.x,
      prevY = this.y;
    this.x = xx;
    this.y = yy;
    if (behavior === AUTO || behavior === SMOOTH) {
      if (isVertical) {
        if (prevY !== yy) {
          this._actualScrollSize = y;
          this.animate(prevY, yy);
        }
      } else {
        if (prevX !== xx) {
          this._actualScrollSize = x;
          this.animate(prevX, xx);
        }
      }
    } else {
      if (isVertical) {
        if (prevY !== yy) {
          if (!blending) {
            if (this._animationCanceler !== undefined) {
              this._animationCanceler();
            }
          }
          this._actualScrollSize = y;
          scrollContent.style.transform = `translate3d(0, ${-yy}px, 0)`;
          if (this.cdkScrollable) {
            this.cdkScrollable.getElementRef().nativeElement.dispatchEvent(SCROLL_EVENT);
          }
          this._$scroll.next();
        }
      } else {
        if (prevX !== xx) {
          if (!blending) {
            if (this._animationCanceler !== undefined) {
              this._animationCanceler();
            }
          }
          this._actualScrollSize = x;
          scrollContent.style.transform = `translate3d(${-xx}px, 0, 0)`;
          if (this.cdkScrollable) {
            this.cdkScrollable.getElementRef().nativeElement.dispatchEvent(SCROLL_EVENT);
          }
          this._$scroll.next();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this._viewportResizeObserver) {
      this._viewportResizeObserver.disconnect();
    }
    if (this._contentResizeObserver) {
      this._contentResizeObserver.disconnect();
    }
  }
}
