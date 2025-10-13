import { Component, effect, ElementRef, inject, input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientColor } from '@shared/types';
import { ButtonSubstrateComponent } from './button-substrate/button-substrate.component';
import { ButtonSubstarateMode, ButtonSubstarateStyle } from './button-substrate/types';
import { ButtonSubstarateModes, ButtonSubstarateStyles } from './button-substrate/enums';
import { ISize } from '../ng-virtual-list';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgb(198, 197, 255)'],
  PROCESSING_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgb(160, 102, 194)'],
  REMOVAL_STROKE_COLOR: GradientColor = ['rgba(0,188,212,0)', 'rgba(255,100,133,1)'],
  SAVING_STROKE_COLOR: GradientColor = ['rgba(0,188,212,0)', 'rgba(0,188,212,1)'];

@Component({
  selector: 'app-button',
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

  readonly strokeColor = signal<GradientColor | undefined>(undefined);

  readonly bounds = signal<ISize>({ width: 0, height: 0 });

  private _resizeObserer: ResizeObserver;

  private _elementRef = inject(ElementRef<HTMLButtonElement>);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLButtonElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLButtonElement;
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    effect(() => {
      const type = this.type();

      //   if (data?.['processing']) {
      //     this.substrateType.set(MessageSubstarateStyles.STROKE);
      //     this.strokeColor.set(PROCESSING_STROKE_COLOR);
      //   } else if (data?.['removal']) {
      //     this.substrateType.set(MessageSubstarateStyles.STROKE);
      //     this.strokeColor.set(REMOVAL_STROKE_COLOR);
      //   } else if (data?.['saving']) {
      //     this.substrateType.set(MessageSubstarateStyles.STROKE);
      //     this.strokeColor.set(SAVING_STROKE_COLOR);
      //   } else {
      //     this.substrateType.set(MessageSubstarateStyles.NONE);
      //     this.strokeColor.set(DEFAULT_STROKE_COLOR);
      //   }
      // } else {
      //   this.substrateType.set(MessageSubstarateStyles.NONE);
      //   this.strokeColor.set(DEFAULT_STROKE_COLOR);
      // }
    });
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
    }
  }
}
