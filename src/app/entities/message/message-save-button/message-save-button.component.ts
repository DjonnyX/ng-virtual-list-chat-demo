import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, Signal, signal } from '@angular/core';
import { ButtonComponent, ButtonSubstarateStyle, ButtonSubstarateStyles } from '@shared/components/button';
import { GradientColor, GradientColorPositions } from '@shared/types';
import { Subject } from 'rxjs';
import { MessageButtonSaveState } from './types';
import { MessageButtonSaveStates } from './enums';
import { ThemeService } from '@shared/theming';
import { toSignal } from '@angular/core/rxjs-interop';
import { PressDirective } from '@shared/directives';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

@Component({
  selector: 'message-save-button',
  imports: [CommonModule, ButtonComponent, PressDirective],
  templateUrl: './message-save-button.component.html',
  styleUrl: './message-save-button.component.scss'
})
export class MessageSaveButtonComponent {
  onClick = output<Event>();

  loading = input<boolean>(false);

  valid = input<boolean>(false);

  state = input<MessageButtonSaveState>(MessageButtonSaveStates.CANCEL);

  fillPositions = input<GradientColorPositions>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  fillColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  pressed = signal<boolean>(false);

  type: Signal<ButtonSubstarateStyle>;

  disabled: Signal<boolean>;

  classes: Signal<{ [name: string]: boolean }>;

  private _$click = new Subject<void>();
  protected $click = this._$click.asObservable();

  private _themeService = inject(ThemeService);

  constructor() {
    const theme = toSignal(this._themeService.$theme);

    this.type = computed(() => {
      const loading = this.loading();
      return loading ? ButtonSubstarateStyles.STROKE : ButtonSubstarateStyles.NONE;
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
      const disabled = this.disabled(), pressed = this.pressed(), state = this.state(), currentTheme = theme();
      switch (state) {
        case MessageButtonSaveStates.SEND: {
          if (disabled) {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.send.disabled.fill ?? DEFAULT_FILL_COLOR);
          } else if (pressed) {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.send.pressed.fill ?? DEFAULT_FILL_COLOR);
          } else {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.send.normal.fill ?? DEFAULT_FILL_COLOR);
          }
          break;
        }
        case MessageButtonSaveStates.CANCEL: {
          if (disabled) {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.cancel.disabled.fill ?? DEFAULT_FILL_COLOR);
          } else if(pressed) {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.cancel.pressed.fill ?? DEFAULT_FILL_COLOR);
          } else {
            this.fillColors.set(currentTheme?.chat.messages.message.controls.cancel.normal.fill ?? DEFAULT_FILL_COLOR);
          }
          break;
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
}
