import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@shared/components/button';
import { SubstarateStyle, SubstarateStyles } from '@shared/components/substrate';
import { ThemeService } from '@shared/theming';
import { GradientColor, GradientColorPositions } from '@shared/types';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

@Component({
  selector: 'message-menu-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-menu-button.component.html',
  styleUrl: './message-menu-button.component.scss'
})
export class MessageMenuButtonComponent {
  onClick = output<Event>();

  disabled = input<boolean>(false);

  fillPositions = input<GradientColorPositions>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  type = signal<SubstarateStyle>(SubstarateStyles.NONE);

  fillColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  pressed = signal<boolean>(false);

  classes: Signal<{ [name: string]: boolean }>;

  private _themeService = inject(ThemeService);

  constructor() {
    const theme = toSignal(this._themeService.$theme);

    this.classes = computed(() => {
      const disabled = this.disabled(), pressed = this.pressed();
      return { pressed, disabled };
    });

    effect(() => {
      const disabled = this.disabled(), pressed = this.pressed(), currentTheme = theme(),
        preset = this._themeService.getPreset(currentTheme?.chat.messages.message.controls.menu);
      if (disabled) {
        this.fillColors.set(preset?.disabled.fill ?? DEFAULT_FILL_COLOR);
      } else if (pressed) {
        this.fillColors.set(preset?.pressed.fill ?? DEFAULT_FILL_COLOR);
      } else {
        this.fillColors.set(preset?.normal.fill ?? DEFAULT_FILL_COLOR);
      }
    });
  }

  onClickHandler(e: Event) {
    this.onClick.emit(e);
  }

  onPressHandler(pressed: boolean) {
    this.pressed.set(pressed);
  }
}
