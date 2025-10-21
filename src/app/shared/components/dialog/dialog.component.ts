import { Component, computed, effect, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IDialogData } from './interfaces';
import { ButtonGroupComponent } from '../button-group';
import { IButtonGroupItem } from '../button-group/interfaces';
import { formatCSSNumber } from '../utils';
import { IDialogTheme } from '@shared/theming/themes/interfaces/components/dialog';
import { SubstarateMode, SubstarateModes, SubstarateStyle, SubstarateStyles, SubstrateComponent } from '../substrate';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { ISize } from '../ng-virtual-list';
import { filter, map, tap } from 'rxjs';

const DEFAULT_ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  DEFAULT_FILL_POSITIONS: GradientColorPositions = [0, 1],
  DEFAULT_STROKE_ANIMATION_DURATION = 1000;

@Component({
  selector: 'x-dialog',
  imports: [CommonModule, SubstrateComponent, ButtonGroupComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  container = viewChild<ElementRef<HTMLDivElement>>('container');

  content = viewChild<ElementRef<HTMLDivElement>>('content');

  title = viewChild<ElementRef<HTMLHeadingElement>>('title');

  message = viewChild<ElementRef<HTMLHeadingElement>>('message');

  private _dialogRef = inject<DialogRef<IDialogData>>(DialogRef<IDialogData>);

  data = inject<IDialogData>(DIALOG_DATA);

  mode = signal<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = signal<SubstarateStyle>(SubstarateStyles.STROKE);

  strokeColor = signal<GradientColor | undefined>(undefined);

  roundCorner = signal<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  fillColors = signal<GradientColor | undefined>(undefined);

  fillPositions = signal<GradientColorPositions | undefined>(DEFAULT_FILL_POSITIONS);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  readonly bounds = signal<ISize>({ width: 250, height: 250 });

  buttonGroupItems: Signal<Array<IButtonGroupItem & { data?: any }>>;

  styles: Signal<{ [prop: string]: string }>;

  theme: Signal<ITheme | undefined>;

  private _resizeObserer: ResizeObserver;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement, $container = toObservable(this.container);
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    $container.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      tap(container => {
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.buttonGroupItems = computed(() => {
      const data = this.data;
      if (Array.isArray(data?.actions)) {
        return data.actions.map(({ action, name, preset, data, }) => ({
          id: action,
          content: name,
          preset,
          data,
        }));
      }
      return [];
    });

    this.styles = computed(() => {
      const data = this.data, result: { [prop: string]: string } = {};
      if (Array.isArray(data?.actions)) {
        result['grid-template-columns'] = `repeat(${data.actions.length}, auto)`;
      }
      return result;
    });

    effect(() => {
      const theme = this.theme(), data = this.data, preset = data.preset, content = this.content()?.nativeElement,
        title = this.title()?.nativeElement, message = this.message()?.nativeElement;
      if (preset && theme && content && title && message) {
        const themePreset = this._themeService.getPreset<IDialogTheme>(theme.presets[preset]);
        if (themePreset) {
          title.style.fontSize = themePreset.title.fontSize ? formatCSSNumber(formatCSSNumber(themePreset.title.fontSize)) : 'inherit';
          title.style.color = themePreset.title.color ? formatCSSNumber(themePreset.title.color) : 'inherit';
          title.style.textAlign = themePreset.title.textAlign ? formatCSSNumber(themePreset.title.textAlign) : 'inherit';
          title.style.fontWeight = themePreset.title.fontWeight ? formatCSSNumber(themePreset.title.fontWeight) : 'inherit';
          title.style.textTransform = themePreset.title.textTransform ? formatCSSNumber(themePreset.title.textTransform) : 'inherit';

          message.style.fontSize = themePreset.message.fontSize ? formatCSSNumber(formatCSSNumber(themePreset.message.fontSize)) : 'inherit';
          message.style.color = themePreset.message.color ? formatCSSNumber(themePreset.message.color) : 'inherit';
          message.style.textAlign = themePreset.message.textAlign ? formatCSSNumber(themePreset.message.textAlign) : 'inherit';
          message.style.fontWeight = themePreset.message.fontWeight ? formatCSSNumber(themePreset.message.fontWeight) : 'inherit';
          message.style.textTransform = themePreset.message.textTransform ? formatCSSNumber(themePreset.message.textTransform) : 'inherit';

          content.style.padding = themePreset.padding ?? 'none';

          this.roundCorner.set(themePreset.roundedCorner ?? DEFAULT_ROUND_CORNER);
          this.fillColors.set(Array.isArray(themePreset.fill) ? themePreset.fill : this.fillColors());
          this.strokeColor.set(Array.isArray(themePreset.strokeGradientColor) ? themePreset.strokeGradientColor : this.strokeColor());
          this.strokeAnimationDuration.set(themePreset.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
        }
      }
    });
  }

  close(data?: any) {
    this._dialogRef.close(data);
  }

  onButtonClickHandler(item: IButtonGroupItem & { data?: any }) {
    this.close(item.data);
  }
}
