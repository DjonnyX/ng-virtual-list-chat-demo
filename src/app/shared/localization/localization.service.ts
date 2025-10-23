import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILocalization } from './localizations/interfaces/localization';
import { getTextDirectionByLocale, LocaleList, Localizations } from './localizations';

const DEFAULT_LOCALE: string = 'he-IL';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private _$locale = new BehaviorSubject<string>(DEFAULT_LOCALE);
  readonly $locale = this._$locale.asObservable();

  private _textDirection: 'rtl' | 'ltr' = getTextDirectionByLocale(this._$locale.getValue());
  get textDirection() { return this._textDirection; }

  private _$localization = new BehaviorSubject<ILocalization>(Localizations[DEFAULT_LOCALE.toString()]);
  readonly $localization = this._$localization.asObservable();
  get localization() { return this._$localization.getValue(); }

  change(locale: string) {
    const actualLocale = LocaleList.includes(locale) ? locale : DEFAULT_LOCALE,
      localization = Localizations[actualLocale],
      textDirection = getTextDirectionByLocale(locale);
    this._textDirection = textDirection;
    this._$localization.next(localization);
    this._$locale.next(actualLocale);
  }
}
