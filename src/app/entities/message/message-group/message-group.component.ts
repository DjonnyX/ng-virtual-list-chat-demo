import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, Signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-message-group',
  imports: [CommonModule, LocaleSensitiveDirective],
  templateUrl: './message-group.component.html',
  styleUrl: './message-group.component.scss'
})
export class MessageGroupComponent {
  private _name = viewChild<ElementRef<HTMLSpanElement>>('name');

  private _indicator = viewChild<ElementRef<HTMLSpanElement>>('indicator');

  text = input<string>();

  classes = input<{ [className: string]: boolean; }>();

  collapsed = input<boolean>(false);

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), classes = this.classes(), nameElement = this._name()?.nativeElement, indicatorElement = this._indicator()?.nativeElement;
      if (theme && nameElement && indicatorElement && classes) {
        const preset = this._themeService.getPreset(theme.chat.messages.group);
        if (preset) {
          if (classes['focused'] && classes['selected']) {
            nameElement.style.backgroundColor = preset.focusedSelected.background;
            nameElement.style.color = preset.focusedSelected.color;
            nameElement.style.borderColor = preset.focusedSelected.borderColor;
            indicatorElement.style.fill = preset.focusedSelected.fill;
          } else if (classes['focused']) {
            nameElement.style.backgroundColor = preset.focused.background;
            nameElement.style.color = preset.focused.color;
            nameElement.style.borderColor = preset.focused.borderColor;
            indicatorElement.style.fill = preset.focused.fill;
          } else if (classes['selected']) {
            nameElement.style.backgroundColor = preset.selected.background;
            nameElement.style.color = preset.selected.color;
            nameElement.style.borderColor = preset.selected.borderColor;
            indicatorElement.style.fill = preset.selected.fill;
          } else {
            nameElement.style.backgroundColor = preset.normal.background;
            nameElement.style.color = preset.normal.color;
            nameElement.style.borderColor = preset.normal.borderColor;
            indicatorElement.style.fill = preset.normal.fill;
          }
        }
      }
    });
  }
}
