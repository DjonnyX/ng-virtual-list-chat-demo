import { CommonModule } from '@angular/common';
import {
  Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { EditableTextComponent } from '@entities/message';
import { ISize } from '@shared/components/ng-virtual-list';
import { IMessageItemData } from "@shared/models/message";
import { Color, GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { IMessageParams } from '../message/interfaces/message-params';
import { SubstarateMode, SubstarateModes, SubstarateStyle, SubstarateStyles, SubstrateComponent } from '@shared/components/substrate';

const DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  BORDER_COLOR: Color = 'rgba(0,0,0,0)',
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'],
  CLASS_REMOVAL = 'removal',
  CLASS_SELECTED = 'selected',
  CLASS_FOCUSED = 'focused',
  IN = 'in',
  OUT = 'out';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-quote',
  imports: [CommonModule, EditableTextComponent, SubstrateComponent],
  templateUrl: './message-quote.component.html',
  styleUrl: './message-quote.component.scss',
  host: {
    'class': 'quote',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageQuoteComponent implements OnDestroy {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  data = input<IProxyCollectionItem<IMessageItemData> | null>(null);

  params = input.required<IMessageParams>();

  classes = input.required<{ [className: string]: boolean; }>();

  fillPositions = input<GradientColorPositions>();

  substarateMode = signal<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  substrateRoundCorner = signal<RoundedCorner>(ROUND_CORNER);

  substrateType = signal<SubstarateStyle>(SubstarateStyles.NONE);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  strokeColor = signal<GradientColor | undefined>(undefined);

  strokeWidth = signal<number>(0);

  fillColors = signal<GradientColor>(DEFAULT_FILL_COLOR);

  rippleColor = signal<Color | undefined>(undefined);

  borderColor = signal<Color | undefined>(BORDER_COLOR);

  theme: Signal<ITheme | undefined>;

  themeType: Signal<'in' | 'out'>;

  private _themeService = inject(ThemeService);

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || 0,
    height: this._container()?.nativeElement?.offsetHeight || 0,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    if (el) {
      const width = el.offsetWidth, height = el.offsetHeight, bounds = this.bounds();
      if (bounds.width === width && bounds.height === height) {
        return;
      }
      this.bounds.set({ width, height });
    }
  }

  @HostBinding('class')
  get hostClasses(): { [key: string]: boolean } {
    return this.classes();
  }
  someCondition = true;

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    this.theme = toSignal(this._themeService.$theme);

    const $container = toObservable(this._container);

    $container.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      tap(container => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(container, { box: "border-box" });
        }
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.themeType = computed(() => {
      return this.params()?.isIncoming === true ? IN : OUT;
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme?.chat.messages.quote.content[type]);
        if (preset) {
          this.rippleColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), type = this.themeType(), currentTheme = this.theme(), containerElement = this._container()?.nativeElement;
      if (containerElement) {
        const preset = this._themeService.getPreset(currentTheme?.chat.messages.quote.content[type]);
        if (preset) {
          if (classes[CLASS_REMOVAL] && classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.removalSelected.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.removalSelected.borderColor);
            containerElement.style.color = preset.removalSelected.color;
          } else if (classes[CLASS_REMOVAL]) {
            this.fillColors.set(preset.removal.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.removal.borderColor);
            containerElement.style.color = preset.removal.color;
          } else if (classes[CLASS_SELECTED] && classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focusedSelected.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.focusedSelected.borderColor);
            containerElement.style.color = preset.focusedSelected.color;
          } else if (classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.selected.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.selected.borderColor);
            containerElement.style.color = preset.selected.color;
          } else if (classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.focused.borderColor);
            containerElement.style.color = preset.focused.color;
          } else {
            this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
            this.borderColor.set(preset.normal.borderColor);
            containerElement.style.color = preset.normal.color;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
  }
}
