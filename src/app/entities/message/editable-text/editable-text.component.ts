import { Component, computed, DestroyRef, effect, ElementRef, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { from, switchMap, tap } from 'rxjs';
import { SearchHighlightDirective } from '@shared/directives';
import { formatText } from '@shared/utils';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { LocaleSensitiveDirective } from '@shared/localization';

const DEFAULT_SEARCH_SUBSTRING_CLASS = 'search-substring',
  INITIAL = 'initial',
  USER_SELECT = 'user-select',
  WEBKIT_USER_SELECT = '-webkit-user-select',
  MOZ_USER_SELECT = '-moz-user-select',
  AUTO = 'auto',
  NONE = 'none';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-editable-text',
  imports: [CommonModule, SearchHighlightDirective, LocaleSensitiveDirective, CdkTextareaAutosize],
  templateUrl: './editable-text.component.html',
  styleUrl: './editable-text.component.scss',
})
export class EditableTextComponent {
  readonlyText = viewChild<ElementRef<HTMLSpanElement>>('readonlyText');

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  editing = input<boolean>(false);

  text = input<string>();

  searchSubstringClass = input<string>(DEFAULT_SEARCH_SUBSTRING_CLASS);

  searchPattern = input<Array<string>>();

  selectable = input<boolean>(false);

  textAreaClick = output<Event>();

  textClick = output<Event>();

  changeText = output<string | undefined>();

  keydown = output<KeyboardEvent>();

  formattedText = signal<string>('');

  theme: Signal<ITheme | undefined>;

  private _destroyRef = inject(DestroyRef);

  private _themeService = inject(ThemeService);

  linkNormalColor = signal<string>(INITIAL);

  linkVisitedColor = signal<string>(INITIAL);

  linkHoverColor = signal<string>(INITIAL);

  linkActiveColor = signal<string>(INITIAL);

  searchSubstringBackground = signal<string>(INITIAL);

  readonlyStyles: Signal<{ [sName: string]: string }>;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    this.readonlyStyles = computed(() => {
      const selectable = this.selectable(), val = selectable ? AUTO : NONE;
      return { [USER_SELECT]: val, [WEBKIT_USER_SELECT]: val, [MOZ_USER_SELECT]: val };
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content);
        if (preset) {
          this.searchSubstringBackground.set(preset.searchSubstringColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content.textEditor.link);
        if (preset) {
          this.linkNormalColor.set(preset.normal.color);
          this.linkVisitedColor.set(preset.visited.color);
          this.linkHoverColor.set(preset.hover.color);
          this.linkActiveColor.set(preset.active);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), textarea = this.textarea()?.nativeElement;
      if (theme && textarea) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content);
        if (preset) {
          textarea.style.backgroundColor = preset.editingTextBackground;
        }
      }
    });

    const $text = toObservable(this.text);

    $text.pipe(
      takeUntilDestroyed(),
      switchMap(text => {
        return from(formatText(text, true)).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(v => {
            this.formattedText.set(v);
          }),
          switchMap(() => {
            return from(formatText(text, false)).pipe(
              takeUntilDestroyed(this._destroyRef),
            );
          }),
          tap(v => {
            this.formattedText.set(v);
          }),
        );
      }),
    ).subscribe();
  }

  onTextAreaClickHandler(e: Event) {
    this.textAreaClick.emit(e);
  }

  onTextClickHandler(e: Event) {
    this.textClick.emit(e);
  }

  onKeyDownHandler(e: KeyboardEvent) {
    e.stopImmediatePropagation();

    this.keydown.emit(e);
  }

  onInputHandler(e: Event) {
    const textarea = this.textarea(), value = textarea?.nativeElement.value;
    this.changeText.emit(value);
  }
}
