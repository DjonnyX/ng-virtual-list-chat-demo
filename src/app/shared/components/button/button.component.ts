import { Component, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { ButtonPresets, ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming/themes/interfaces/theme';
import { PressDirective } from '@shared/directives';
import { SubstrateComponent, SubstarateMode, SubstarateStyle, SubstarateModes, SubstarateStyles } from '../substrate';
import { ISize } from '../ng-virtual-list';
import { filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { formatCSSNumber } from '../utils';

const DEFAULT_ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  CLASS_PRESSED = 'pressed',
  CLASS_FOCUSED = 'focused',
  CLASS_DISABLED = 'disabled';

@Component({
  selector: 'x-button',
  imports: [
    CommonModule,
    SubstrateComponent,
    PressDirective,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnDestroy {
  button = viewChild<ElementRef<HTMLButtonElement>>('button');

  mode = input<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = input<SubstarateStyle>(SubstarateStyles.NONE);

  content = input<string | undefined>();

  strokeColor = input<GradientColor | undefined>(undefined);

  roundCorner = input<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  disabled = input<boolean>(false);

  pressed = signal<boolean>(false);

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(undefined);

  preset = input<ButtonPresets | string | undefined>(undefined);

  onClick = output<Event>();

  onFocus = output<boolean>();

  onPress = output<boolean>();

  readonly bounds = signal<ISize>({ width: 0, height: 0 });

  focused = signal<boolean>(false);

  fillGradientColors = signal<GradientColor | undefined>(this.fillColors());

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  theme: Signal<ITheme | undefined>;

  private _resizeObserer: ResizeObserver;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement, $button = toObservable(this.button);
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    this.theme = toSignal(this._themeService.$theme);

    $button.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(button => {
        return fromEvent(button, 'focus').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
            this.onFocus.emit(true);
          }),
          switchMap(() => {
            return fromEvent(button, 'blur').pipe(
              takeUntilDestroyed(this._destroyRef),
              tap(() => {
                this.focused.set(false);
                this.onFocus.emit(false);
              }),
            );
          })
        );
      }),
    ).subscribe();

    effect(() => {
      const pressed = this.pressed(), focused = this.focused(), disabled = this.disabled();
      const el = this._elementRef.nativeElement as HTMLDivElement;
      if (pressed) {
        el.classList.add(CLASS_PRESSED);
      } else {
        el.classList.remove(CLASS_PRESSED);
      }
      if (focused) {
        el.classList.add(CLASS_FOCUSED);
      } else {
        el.classList.remove(CLASS_FOCUSED);
      }
      if (disabled) {
        el.classList.add(CLASS_DISABLED);
      } else {
        el.classList.remove(CLASS_DISABLED);
      }
    });

    effect(() => {
      const preset = this.preset(), theme = this.theme();
      if (theme && preset) {
        const buttonPreset = this._themeService.getPreset(preset);
        if (buttonPreset) {
          const el = this._elementRef.nativeElement as HTMLDivElement,
            elBtn = this.button()?.nativeElement as HTMLButtonElement;
          if (el && elBtn) {
            const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused();
            if (disabled) {
              this.shapeRoundCorner.set(buttonPreset.disabled.roundedCorner);
              this.fillGradientColors.set(buttonPreset.disabled.fill);
              el.style.color = buttonPreset.disabled.color ? `var(--theme-presets-${preset}-disabled-color)` : 'inherit';
              elBtn.style.padding = buttonPreset.disabled.padding ? `var(--theme-presets-${preset}-disabled-padding)` : 'unset';
              elBtn.style.outline = buttonPreset.disabled.outline ? `var(--theme-presets-${preset}-disabled-outline)` : 'unset';
              elBtn.style.borderTopLeftRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[0]) : 'unset';
              elBtn.style.borderBottomLeftRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[1]) : 'unset';
              elBtn.style.borderBottomRightRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[2]) : 'unset';
              elBtn.style.borderTopRightRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[3]) : 'unset';
            } else if (focused) {
              this.shapeRoundCorner.set(buttonPreset.focused.roundedCorner);
              this.fillGradientColors.set(buttonPreset.focused.fill);
              el.style.color = buttonPreset.focused.color ? `var(--theme-presets-${preset}-focused-color)` : 'inherit';
              elBtn.style.padding = buttonPreset.focused.padding ? `var(--theme-presets-${preset}-focused-padding)` : 'unset';
              elBtn.style.outline = buttonPreset.focused.outline ? `var(--theme-presets-${preset}-focused-outline)` : 'unset';
              elBtn.style.borderTopLeftRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[0]) : 'unset';
              elBtn.style.borderBottomLeftRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[1]) : 'unset';
              elBtn.style.borderBottomRightRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[2]) : 'unset';
              elBtn.style.borderTopRightRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[3]) : 'unset';
            } else if (pressed) {
              this.shapeRoundCorner.set(buttonPreset.pressed.roundedCorner);
              this.fillGradientColors.set(buttonPreset.pressed.fill);
              el.style.color = buttonPreset.pressed.color ? `var(--theme-presets-${preset}-pressed-color)` : 'inherit';
              elBtn.style.padding = buttonPreset.pressed.padding ? `var(--theme-presets-${preset}-pressed-padding)` : 'unset';
              elBtn.style.outline = buttonPreset.pressed.outline ? `var(--theme-presets-${preset}-pressed-outline)` : 'unset';
              elBtn.style.borderTopLeftRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[0]) : 'unset';
              elBtn.style.borderBottomLeftRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[1]) : 'unset';
              elBtn.style.borderBottomRightRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[2]) : 'unset';
              elBtn.style.borderTopRightRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[3]) : 'unset';
            } else {
              this.shapeRoundCorner.set(buttonPreset.normal.roundedCorner);
              this.fillGradientColors.set(buttonPreset.normal.fill);
              el.style.color = buttonPreset.normal.color ? `var(--theme-presets-${preset}-normal-color)` : 'inherit';
              elBtn.style.padding = buttonPreset.normal.padding ? `var(--theme-presets-${preset}-normal-padding)` : 'unset';
              elBtn.style.outline = buttonPreset.normal.outline ? `var(--theme-presets-${preset}-normal-outline)` : 'unset';
              elBtn.style.borderTopLeftRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[0]) : 'unset';
              elBtn.style.borderBottomLeftRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[1]) : 'unset';
              elBtn.style.borderBottomRightRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[2]) : 'unset';
              elBtn.style.borderTopRightRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[3]) : 'unset';
            }
            return;
          }
        }
      }
      this.fillGradientColors.set(this.fillColors());
      this.shapeRoundCorner.set(this.roundCorner());
    });
  }

  onPressHandler(pressed: boolean) {
    this.pressed.set(pressed);
    this.onPress.emit(pressed);
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


