import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, from, of, switchMap, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { ITheme } from './themes/interfaces/theme';
import { THEME_LIGHT } from './themes/light';
import { ThemeName, Themes } from './themes/themes';
import { serializeToRootVars } from './utils/theme-serializer';
import { loadStyle } from './utils';

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
          vars = !environment.prod ? serializeToRootVars(theme) : undefined;
        return of({ name, theme, vars });
      }),
      filter(v => !!v),
      switchMap(({ theme, name, vars }) => {
        if (vars === undefined) {
          return from(loadStyle(`themes/${name}.css`)).pipe(
            switchMap(() => of({ theme })),
            catchError(err => {
              console.log(`Theme "${name}" loading error.`);
              return of({ theme: undefined });
            })
          );
        }

        for (const varName in vars) {
          const value = (vars as { [key: string]: string })[varName];
          document.documentElement.style.setProperty(varName, value);
        }
        return of({ theme })
      }),
      tap(({ theme }) => {
        if (theme) {
          this._$theme.next(theme);
        }
      }),
    ).subscribe();

    const prefersDarkScheme = window.matchMedia(IS_DARK_THEME_PATTERN);

    prefersDarkScheme.addEventListener(CHANGE_EVENT, (event) => {
      this.setupThemeAutomatically(event.matches);
    });
  }

  private async setupThemeAutomatically(isDark: boolean) {
    if (this._$name.getValue() === 'auto') {
      const name = isDark ? 'dark' : 'light', theme = Themes[name],
        vars = !environment.prod ? serializeToRootVars(theme) : undefined;

      if (vars === undefined) {
        try {
          await loadStyle(`themes/${name}.css`);

          this._$theme.next(theme);
        } catch (err) { }
      } else {
        for (const varName in vars) {
          const value = (vars as { [key: string]: string })[varName];
          document.documentElement.style.setProperty(varName, value);
        }

        this._$theme.next(theme);
      }
    }
  }
}
