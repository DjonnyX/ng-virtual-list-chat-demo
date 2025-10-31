import { Component, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ScrollerDirection } from './enums';
import { ScrollBox } from './utils';
import { ScrollerDirections } from './enums';
import { Id } from '../../types';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { Easing } from './types';
import { easeLinear } from './utils/ease';

interface IScrollToParams {
  x?: number;
  y?: number;
  left?: number;
  top?: number;
  behavior?: ScrollBehavior;
}

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
export class XScrollerComponent {
  scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

  scrollViewport = viewChild<ElementRef<HTMLDivElement>>('scrollViewport');

  direction = input<ScrollerDirections>(ScrollerDirection.VERTICAL);

  focusedElement = input<Id | undefined>(undefined);

  content = input<HTMLElement>();

  private _scrollBox = new ScrollBox();

  get host() {
    return this.scrollViewport()?.nativeElement;
  }

  get scrollWidth() {
    return (this.scrollViewport()?.nativeElement.scrollWidth ?? 0);
  }

  get scrollHeight() {
    return (this.scrollViewport()?.nativeElement.scrollHeight ?? 0);
  }

  private _x: number = 0;

  private _y: number = 0;

  private _animationCanceler: Function | undefined;

  private _destroyRef = inject(DestroyRef);

  get scrollLeft() {
    return (this.scrollViewport()?.nativeElement.scrollLeft ?? 0);
  }

  get scrollTop() {
    return (this.scrollViewport()?.nativeElement.scrollTop ?? 0);
  }

  constructor() {
    const $scrollViewport = toObservable(this.scrollViewport);

    $scrollViewport.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(scrollViewport => {
        return fromEvent<Event>(scrollViewport, 'scroll').pipe(
          takeUntilDestroyed(this._destroyRef),
        );
      }),
      tap(() => {
        const x = this.scrollLeft, y = this.scrollTop;
        if (this._x !== x || this._y !== y) {
          this.scrollTo({ left: x, top: y });
        }
      }),
    ).subscribe();
  }

  animate(startValue: number, endValue: number, duration = 150, easingFunction: Easing = easeLinear) {
    if (this._animationCanceler !== undefined) {
      this._animationCanceler();
    }
    const startTime = performance.now(), isVertical = this.direction() === ScrollerDirection.VERTICAL;
    let isCanceled = false;

    if (isVertical) {
      this._y = startValue;
    } else {
      this._x = startValue;
    }

    const step = (currentTime: number) => {
      if (!!isCanceled) {
        return;
      }

      if ((isVertical && this._y >= startValue && this._y <= endValue) || (!isVertical && this._x >= startValue && this._x <= endValue)) {
        if (isVertical) {
          this._y = startValue;
        } else {
          this._x = startValue;
        }

        const elapsed = currentTime - startTime,
          progress = Math.min(elapsed / duration, 1),
          easedProgress = easingFunction(progress),
          currentValue = startValue + (endValue - startValue) * easedProgress;

        const scrollViewport = this.scrollViewport()?.nativeElement as HTMLDivElement;
        if (scrollViewport) {
          if (isVertical) {
            scrollViewport.scrollTop = this._y = currentValue;
          } else {
            scrollViewport.scrollLeft = this._x = currentValue;
          }
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
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
      behavior = params.behavior ?? 'instant',
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

    if (isVertical) {
      const prevY = this._y;
      this._y = y;
      if (behavior === 'auto' || behavior === 'smooth') {
        this.animate(prevY, y);
      } else {
        if (this._animationCanceler !== undefined) {
          this._animationCanceler();
        }
        scrollViewport.scrollTop = y;
      }
    } else {
      const prevX = this._x;
      this._x = x;
      if (behavior === 'auto' || behavior === 'smooth') {
        this.animate(prevX, x);
      } else {
        if (this._animationCanceler !== undefined) {
          this._animationCanceler();
        }
        scrollViewport.scrollLeft = x;
      }
    }
  }
}
