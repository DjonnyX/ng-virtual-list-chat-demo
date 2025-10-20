import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '@shared/components/button';
import { SubstarateStyle, SubstarateStyles } from '@shared/components/substrate';
import { GradientColor, GradientColorPositions } from '@shared/types';
import { Subject } from 'rxjs';
import { MessageButtonSaveState } from './types';
import { MessageButtonSaveStates } from './enums';
import { ThemeService } from '@shared/theming';
import { toSignal } from '@angular/core/rxjs-interop';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

@Component({
  selector: 'message-save-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-save-button.component.html',
  styleUrl: './message-save-button.component.scss'
})
export class MessageSaveButtonComponent {
  content = viewChild<ElementRef<HTMLDivElement>>('content');

  onClick = output<Event>();

  loading = input<boolean>(false);

  valid = input<boolean>(false);

  state = input<MessageButtonSaveState>(MessageButtonSaveStates.CANCEL);

  fillPositions = input<GradientColorPositions>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  fillColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  pressed = signal<boolean>(false);

  focused = signal<boolean>(false);

  type: Signal<SubstarateStyle>;

  disabled: Signal<boolean>;

  classes: Signal<{ [name: string]: boolean }>;

  private _$click = new Subject<void>();
  protected $click = this._$click.asObservable();

  private _themeService = inject(ThemeService);

  constructor() {
    const theme = toSignal(this._themeService.$theme);

    this.type = computed(() => {
      const loading = this.loading();
      return loading ? SubstarateStyles.STROKE : SubstarateStyles.NONE;
    });

    this.classes = computed(() => {
      const state = this.state(), disabled = this.disabled(), pressed = this.pressed();
      return { [state]: true, pressed, disabled };
    });

    this.disabled = computed(() => {
      const state = this.state(), valid = this.valid(), loading = this.loading();
      return (state === MessageButtonSaveStates.SEND) && (!valid || loading);
    });

    effect(() => {
      const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused(), state = this.state(), currentTheme = theme(),
        contentEl = this.content()?.nativeElement;
      if (contentEl && currentTheme) {
        let preset: any | undefined;
        switch (state) {
          case MessageButtonSaveStates.SEND: {
            preset = this._themeService.getPreset(currentTheme.chat.messages.message.controls.send);
            break;
          }
          case MessageButtonSaveStates.CANCEL: {
            preset = this._themeService.getPreset(currentTheme.chat.messages.message.controls.cancel);
            break;
          }
        }
        if (preset) {
          if (disabled) {
            this.fillColors.set(preset.disabled.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.disabled.iconFill;
          } else if (focused && preset.focused) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.focused.iconFill;
          } else if (pressed) {
            this.fillColors.set(preset.pressed.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.pressed.iconFill;
          } else {
            this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.normal.iconFill;
          }
        }
      }
    });
  }

  onClickHandler(e: Event) {
    this.onClick.emit(e);
    this._$click.next();
  }

  onPressHandler(pressed: boolean) {
    this.pressed.set(pressed);
  }

  onFocusHandler(focused: boolean) {
    this.focused.set(focused);
  }
}
