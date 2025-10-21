import { Component, DestroyRef, effect, ElementRef, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchHighlightDirective } from '@shared/directives';
import { formatText } from '@shared/utils';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { from, switchMap, tap } from 'rxjs';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';

const DEFAULT_SEARCH_SUBSTRING_CLASS = 'search-substring';

@Component({
  selector: 'editable-text',
  imports: [CommonModule, SearchHighlightDirective, CdkTextareaAutosize],
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

  textAreaClick = output<Event>();

  textClick = output<Event>();

  changeText = output<string>();

  keydown = output<KeyboardEvent>();

  formattedText = signal<string>('');

  theme: Signal<ITheme | undefined>;

  private _destroyRef = inject(DestroyRef);

  private _themeService = inject(ThemeService);

  linkNormalColor = signal<string>('initial');

  linkVisitedColor = signal<string>('initial');

  linkHoverColor = signal<string>('initial');

  linkActiveColor = signal<string>('initial');

  searchSubstringBackground = signal<string>('initial');

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

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
    ).subscribe()

    effect(() => {
      const text = this.text();
      this.emitValue(text);
    });
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

  onChangeHandler(e: Event) {
    this.emitValue();
  }

  onInputHandler(e: Event) {
    this.emitValue();
  }

  private emitValue(v?: string) {
    const textarea = this.textarea();
    if (textarea) {
      this.changeText.emit(v ?? textarea.nativeElement.value);
    }
  }
}
