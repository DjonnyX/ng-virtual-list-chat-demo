import { Component, effect, ElementRef, inject, input, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { SubstrateComponent, SubstarateMode, SubstarateStyle, SubstarateModes, SubstarateStyles } from '../substrate';
import { ISize } from '../x-virtual-list';

const DEFAULT_ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  CLASS_CHECKED = 'checked',
  CLASS_DISABLED = 'disabled';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-check-box',
  imports: [
    CommonModule,
    SubstrateComponent,
  ],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.scss',
})
export class CheckBoxComponent implements OnDestroy {
  mode = input<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = input<SubstarateStyle>(SubstarateStyles.NONE);

  content = input<string | undefined>();

  value = input<boolean>(false);

  strokeColor = input<GradientColor | undefined>(undefined);

  roundCorner = input<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  disabled = input<boolean>(false);

  onClick = output<Event>();

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(undefined);

  readonly bounds = signal<ISize>({ width: 0, height: 0 });

  private _resizeObserer: ResizeObserver;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement;
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    effect(() => {
      const disabled = this.disabled(), value = this.value();
      const el = this._elementRef.nativeElement as HTMLDivElement;
      if (disabled) {
        el.classList.add(CLASS_DISABLED);
      } else {
        el.classList.remove(CLASS_DISABLED);
      }
      if (value) {
        el.classList.add(CLASS_CHECKED);
      } else {
        el.classList.remove(CLASS_CHECKED);
      }
    });
  }

  onClickHandler(e: Event) {
    const disabled = this.disabled();
    if (disabled) {
      e.stopImmediatePropagation();
      return;
    }
    this.onClick.emit(e);
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
    }
  }
}
