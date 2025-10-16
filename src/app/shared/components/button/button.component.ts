import { Component, effect, ElementRef, inject, input, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientColor } from '@shared/types';
import { ButtonSubstrateComponent } from './button-substrate/button-substrate.component';
import { ButtonSubstarateMode, ButtonSubstarateStyle } from './button-substrate/types';
import { ButtonSubstarateModes, ButtonSubstarateStyles } from './button-substrate/enums';
import { ISize } from '../ng-virtual-list';

const DEFAULT_ROUND_CORNER = [8, 8, 8, 8],
  CLASS_DISABLED = 'disabled';

@Component({
  selector: 'x-button',
  imports: [
    CommonModule,
    ButtonSubstrateComponent,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnDestroy {
  mode = input<ButtonSubstarateMode>(ButtonSubstarateModes.ROUNDED_RECTANGLE);

  type = input<ButtonSubstarateStyle>(ButtonSubstarateStyles.NONE);

  content = input<string | undefined>();

  strokeColor = input<GradientColor | undefined>(undefined);

  roundCorner = input<Array<number> | undefined>(DEFAULT_ROUND_CORNER);

  disabled = input<boolean>(false);

  onClick = output<Event>();

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
      const disabled = this.disabled();
      const el = this._elementRef.nativeElement as HTMLDivElement;
      if (disabled) {
        el.classList.add(CLASS_DISABLED);
      } else {
        el.classList.remove(CLASS_DISABLED);
      }
    });
  }

  onClickHandler(e: Event) {
    this.onClick.emit(e);
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
    }
  }
}
