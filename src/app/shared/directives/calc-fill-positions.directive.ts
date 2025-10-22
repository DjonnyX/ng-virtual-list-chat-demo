import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IDisplayObjectMeasures } from '@shared/components/ng-virtual-list';
import { GradientColorPositions } from '@shared/types';
import { delay, tap } from 'rxjs';

@Directive({
  selector: '[calcFillPositions]'
})
export class CalcFillPositionsDirective {

  measures = input<IDisplayObjectMeasures | undefined>(undefined);

  onFillPositions = output<GradientColorPositions>();

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  constructor() {
    const $measures = toObservable(this.measures);

    $measures.pipe(
      takeUntilDestroyed(),
      delay(0),
      tap(() => {
        this.calculate();
      }),
    ).subscribe();

    effect(() => {
      this.calculate();
    });
  }

  private calculate() {
    const measures = this.measures();
    if (measures) {
      const { y: pos, height: size } = (this._elementRef?.nativeElement as HTMLDivElement).getBoundingClientRect(),
        { boundsSize, positionOffset } = measures,
        absoluteStartPosition = pos - positionOffset, ratio = boundsSize / size,
        absoluteStartPositionPercent = -(absoluteStartPosition / boundsSize) * ratio,
        absoluteEndPosition = boundsSize - (absoluteStartPositionPercent + size),
        absoluteEndPositionPercent = (absoluteStartPositionPercent + ((absoluteEndPosition + size) / boundsSize) * ratio);
      this.onFillPositions.emit([absoluteStartPositionPercent, absoluteEndPositionPercent]);
    }
  }
}
