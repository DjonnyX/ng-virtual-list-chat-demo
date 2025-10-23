import { Directive, ElementRef, inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { getTextDirectionByLocale } from './localizations';

@Directive({
  selector: '[localeSensitive]'
})
export class LocaleSensitiveDirective {
  private _localizationService = inject(LocalizationService);

  private _elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this._localizationService.$locale.pipe(
      takeUntilDestroyed(),
      tap(() => {
        const dir = this._localizationService.textDirection,
          element = this._elementRef.nativeElement as HTMLElement;
        element.setAttribute('dir', dir);
        if (dir === 'rtl') {
          element.style.textAlign = 'right';
          element.classList.add('rtl');
          element.classList.remove('ltr');
        } else {
          element.classList.add('ltr');
          element.classList.remove('rtl');
        }
      }),
    ).subscribe();
  }
}
