import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, Signal, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SubstarateStyle, SubstarateStyles, SubstrateComponent } from '@shared/components/substrate';
import { ITheme, ThemeService } from '@shared/theming';
import { IScrollBarTheme } from '@shared/theming/themes/interfaces/components/scrollbar';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { combineLatest, filter, map, tap } from 'rxjs';

const DEFAULT_THICKNESS = 6,
  DEFAULT_SIZE = 6,
  DEFAULT_ROUNDED_CORNER: RoundedCorner = [3, 3, 3, 3],
  DEFAULT_STROKE_ANIMATION_DURATION = 500,
  TRANSLATE_3D = 'translate3d',
  PX = 'px',
  WIDTH = 'width',
  HEIGHT = 'height',
  OPACITY = 'opacity',
  OPACITY_0 = '0',
  OPACITY_1 = '1',
  TRANSITION = 'transition',
  NONE = 'none',
  TRANSITION_FADE_IN = `${OPACITY} 500ms ease-out`;

@Component({
  selector: 'x-scroll-bar',
  imports: [CommonModule, SubstrateComponent],
  templateUrl: './x-scroll-bar.component.html',
  styleUrl: './x-scroll-bar.component.scss'
})
export class XScrollBarComponent {
  thumb = viewChild<ElementRef<HTMLDivElement>>('thumb');

  track = viewChild<ElementRef<HTMLDivElement>>('track');

  loading = input<boolean>(false);

  isVertical = input<boolean>(true);

  position = input<number>(0);

  thumbGradientPositions = input<GradientColorPositions>([0, 0]);

  size = input<number>(DEFAULT_SIZE);

  preset = input<string | undefined>(undefined);

  prepared = input<boolean>(false);

  show = signal<boolean>(false);

  thickness = signal<number>(DEFAULT_THICKNESS);

  thumbGradientFill = signal<string | GradientColor | undefined>(undefined);

  strokeGradientColor = signal<string | GradientColor | undefined>(undefined);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  roundCorner = signal<RoundedCorner>(DEFAULT_ROUNDED_CORNER);

  type: Signal<SubstarateStyle>;

  styles: Signal<{ [sName: string]: any }>;

  thumbWidth: Signal<number>;

  thumbHeight: Signal<number>;

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  constructor() {
    const $prepared = toObservable(this.prepared),
      $track = toObservable(this.track).pipe(
        takeUntilDestroyed(),
        filter(v => !!v),
        map(v => v.nativeElement),
      ),
      $isVertical = toObservable(this.isVertical),
      $size = toObservable(this.size);

    combineLatest([$prepared, $track, $isVertical, $size]).pipe(
      takeUntilDestroyed(),
      tap(([prepared, track, isVertical, size]) => {
        const total = isVertical ? track.offsetHeight : track.offsetWidth;
        this.show.set(prepared && size > 0 && size < total);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.thumbWidth = computed(() => {
      return this.isVertical() ? this.thickness() : this.size();
    });

    this.thumbHeight = computed(() => {
      return this.isVertical() ? this.size() : this.thickness();
    });

    this.type = computed(() => {
      return this.loading() ? SubstarateStyles.STROKE : SubstarateStyles.NONE;
    });

    this.styles = computed(() => {
      const show = this.show();
      return {
        [this.isVertical() ? WIDTH : HEIGHT]: `${this.thickness()}${PX}`,
        [OPACITY]: show ? OPACITY_1 : OPACITY_0, [TRANSITION]: show ? TRANSITION_FADE_IN : NONE,
      };
    });

    effect(() => {
      const position = this.position(), isVertical = this.isVertical(), thumb = this.thumb()?.nativeElement;
      if (thumb) {
        if (isVertical) {
          thumb.style.transform = `${TRANSLATE_3D}(0, ${position}${PX}, 0)`;
        } else {
          thumb.style.transform = `${TRANSLATE_3D}(${position}${PX}, 0, 0)`;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), preset = this.preset();
      if (theme && preset) {
        const themePreset = this._themeService.getPreset<IScrollBarTheme>(theme.presets[preset]);
        if (themePreset) {
          this.thumbGradientFill.set(themePreset.fill);
          this.strokeGradientColor.set(themePreset.strokeGradientColor);
          this.strokeAnimationDuration.set(themePreset.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
        }
      }
    });
  }
}
