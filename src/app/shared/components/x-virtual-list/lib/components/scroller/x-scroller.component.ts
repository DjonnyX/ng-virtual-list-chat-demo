import { Component, ElementRef, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ScrollerDirection } from './enums';
import { ScrollBox } from './utils';
import { ScrollerDirections } from './enums';
import { Id } from '../../types';
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

  classes = input<{ [cName: string]: boolean }>({});

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

  get scrollLeft() {
    return (this.scrollViewport()?.nativeElement.scrollLeft ?? 0);
  }

  get scrollTop() {
    return (this.scrollViewport()?.nativeElement.scrollTop ?? 0);
  }

  animate(startValue: number, endValue: number, duration = 500, easingFunction: Easing = easeLinear) {
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

      if (isVertical) {
        startValue = this._y;
      } else {
        startValue = this._x;
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

    const prevX = this._x;
    const prevY = this._y;
    this._x = x;
    this._y = y;
    if (behavior === 'auto' || behavior === 'smooth') {
      if (isVertical) {
        if (prevY !== y) {
          this.animate(prevY, y);
        }
      } else {
        if (prevX !== x) {
          this.animate(prevX, x);
        }
      }
    } else {
      if (isVertical) {
        if (prevY !== y) {
          if (this._animationCanceler !== undefined) {
            this._animationCanceler();
          }
          scrollViewport.scrollTop = y;
        }
      } else {
        if (prevX !== x) {
          if (this._animationCanceler !== undefined) {
            this._animationCanceler();
          }
          scrollViewport.scrollLeft = x;
        }
      }
    }
  }
}
