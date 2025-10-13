import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { ITheme } from './themes/interfaces/theme';
import { THEME_LIGHT } from './themes/light';
import { ThemeName, Themes } from './themes/themes';
import { serializeToRootVars } from './utils/theme-serializer';

const IS_DARK_THEME_PATTERN = '(prefers-color-scheme: dark)',
  CHANGE_EVENT = 'change';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _$name = new BehaviorSubject<ThemeName>('auto');
  readonly $name = this._$name.asObservable();

  set name(v: string) {
    this._$name.next(v);
  }
  private _theme: ITheme = THEME_LIGHT;
  get theme(): ITheme { return this._theme; }

  private _$theme = new BehaviorSubject<ITheme>(THEME_LIGHT);
  readonly $theme = this._$theme.asObservable();

  constructor() {
    this.$theme.pipe(
      takeUntilDestroyed(),
      tap(theme => {
        this._theme = theme;
      }),
    ).subscribe();

    this._$name.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      switchMap(name => {
        if (name === 'auto') {
          this.setupThemeAutomatically(window.matchMedia(IS_DARK_THEME_PATTERN).matches);
          return of();
        }

        const theme = Themes[name],
          vars = serializeToRootVars(theme);
        return of({ theme, vars });
      }),
      filter(v => !!v),
      tap(({ vars }) => {
        for (const varName in vars) {
          const value = (vars as { [key: string]: string })[varName];
          document.documentElement.style.setProperty(varName, value);
        }
      }),
      tap(({ theme }) => {
        this._$theme.next(theme);
      }),
    ).subscribe();

    const prefersDarkScheme = window.matchMedia(IS_DARK_THEME_PATTERN);

    prefersDarkScheme.addEventListener(CHANGE_EVENT, (event) => {
      this.setupThemeAutomatically(event.matches);
    });
  }

  private setupThemeAutomatically(isDark: boolean) {
    if (this._$name.getValue() === 'auto') {
      const theme = Themes[isDark ? 'dark' : 'light'],
        vars = serializeToRootVars(theme);

      for (const varName in vars) {
        const value = (vars as { [key: string]: string })[varName];
        document.documentElement.style.setProperty(varName, value);
      }

      this._$theme.next(theme);
    }
  }
}
