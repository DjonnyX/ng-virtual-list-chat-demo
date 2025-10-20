import { Component, DestroyRef, effect, ElementRef, inject, output, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming/themes/interfaces/theme';
import { combineLatest, filter, fromEvent, interval, map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

const INTERVAL_COUNT = 89, INTERVAL_TIMEOUT = 100, PERCENT = '%', ZERO_PERCENT = `0${PERCENT}`;

@Component({
  selector: 'message-search',
  imports: [FormsModule],
  templateUrl: './message-search.component.html',
  styleUrl: './message-search.component.scss'
})
export class MessageSearchComponent {
  input = viewChild<ElementRef<HTMLInputElement>>('input');

  indicator = viewChild<ElementRef<HTMLDivElement>>('indicator');

  icon = viewChild<ElementRef<HTMLDivElement>>('icon');

  search = output<string>();

  focused = signal<boolean>(false);

  theme: Signal<ITheme | undefined>;

  private _$reset = new Subject<void>();
  readonly $reset = this._$reset.asObservable();

  searchText = '';

  placeholderColor = signal<string>('innitial');

  placeholderFontSize = signal<string>('initial');

  private _destroyRef = inject(DestroyRef);

  private _themeService = inject(ThemeService);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), focused = this.focused(), iconElement = this.icon()?.nativeElement;
      if (iconElement && theme) {
        const preset = this._themeService.getPreset(theme.chat.header.search);
        if (preset) {
          if (focused) {
            iconElement.style.fill = preset.focused.fill;
          } else {
            iconElement.style.fill = preset.normal.fill;
          }
        }
      }
    });

    effect(() => {
      const theme = this.theme(), indicatorElement = this.indicator()?.nativeElement;
      if (indicatorElement && theme) {
        const preset = this._themeService.getPreset(theme.chat.header.search);
        if (preset) {
          indicatorElement.style.background = preset.timeoutIndicatorColor;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), focused = this.focused(), inputElement = this.input()?.nativeElement;
      if (inputElement && theme) {
        const preset = this._themeService.getPreset(theme.chat.header.search);
        if (preset) {
          if (focused) {
            inputElement.style.background = preset.focused.background;
            inputElement.style.borderColor = preset.focused.borderColor;
            inputElement.style.color = preset.focused.color;
            inputElement.style.fontSize = preset.focused.fontSize;
            this.placeholderColor.set(preset.focused.placeholder.color);
            this.placeholderFontSize.set(preset.focused.placeholder.fontSize);
          } else {
            inputElement.style.background = preset.normal.background;
            inputElement.style.borderColor = preset.normal.borderColor;
            inputElement.style.color = preset.normal.color;
            inputElement.style.fontSize = preset.normal.fontSize;
            this.placeholderColor.set(preset.normal.placeholder.color);
            this.placeholderFontSize.set(preset.normal.placeholder.fontSize);
          }
        }
      }
    });

    const $input = toObservable(this.input),
      $indicator = toObservable(this.indicator),
      $reset = this.$reset;

    $input.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(input => {
        return fromEvent(input, 'focus').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
          }),
          switchMap(() => {
            return fromEvent(input, 'blur').pipe(
              takeUntilDestroyed(this._destroyRef),
              tap(() => {
                this.focused.set(false);
              }),
            );
          }),
        );
      }),
    ).subscribe();

    const $blur = $input.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(input => {
        return fromEvent(input.nativeElement, 'blur').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            const inputElement = input?.nativeElement,
              indicatorElement = this.indicator()?.nativeElement;
            if (inputElement) {
              // reset
              inputElement.value = '';
              inputElement.blur();
              this.search.emit('');
            }
            if (indicatorElement) {
              indicatorElement.style.width = ZERO_PERCENT;
            }
          }),
        );
      }),
    );

    combineLatest([$input, $indicator]).pipe(
      takeUntilDestroyed(),
      map(([input, indicator]) => ({ input, indicator })),
      filter(({ input, indicator }) => !!input && !!indicator),
      switchMap(({ input, indicator }) => {
        return $reset.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(() => {
            const indicatorElement = indicator?.nativeElement;
            if (indicatorElement) {
              indicatorElement.style.width = ZERO_PERCENT;
            }
            return interval(INTERVAL_TIMEOUT).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($blur),
              take(INTERVAL_COUNT + 1),
              tap((count) => {
                if (count === INTERVAL_COUNT) {
                  const inputElement = input?.nativeElement,
                    indicatorElement = indicator?.nativeElement;
                  if (inputElement) {
                    // reset
                    inputElement.value = '';
                    inputElement.blur();
                    this.search.emit('');
                  }
                  if (indicatorElement) {
                    indicatorElement.style.width = ZERO_PERCENT;
                  }
                } else {
                  const w = (count / INTERVAL_COUNT) * 100;
                  const indicatorElement = indicator?.nativeElement;
                  if (indicatorElement) {
                    indicatorElement.style.width = `${w}${PERCENT}`;
                  }
                }
              }),
            );
          }),
        )
      })
    ).subscribe();
  }

  onSearchHandler() {
    this.search.emit(this.searchText);
    this._$reset.next();
  }
}
