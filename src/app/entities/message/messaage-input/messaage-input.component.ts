import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { ISize } from '@shared/components/x-virtual-list';
import { LocaleSensitiveDirective } from '@shared/localization';
import { GradientColorPositions } from '@shared/types';
import { MessageSendButtonComponent } from '../message-send-button/message-send-button.component';
import { MessageButtonSendStates } from '../message-send-button/enums';
import { MessageButtonSaveState } from '../message-save-button/types';
import { MessageButtonSaveStates } from '../message-save-button/enums';
import { ITheme, ThemeService } from '@shared/theming';

const DEFAULT_TEXTAREA_SIZE = 16,
  MAX_TEXTAREA_HEIGHT = 320,
  HIDDEN = 'hidden',
  AUTO = 'auto',
  NONE = 'none';

@Component({
  selector: 'x-messaage-input',
  imports: [CommonModule, LocaleSensitiveDirective, CdkTextareaAutosize, MessageSendButtonComponent],
  templateUrl: './messaage-input.component.html',
  styleUrl: './messaage-input.component.scss'
})
export class MessaageInputComponent implements OnDestroy {
  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  text = input<string>();

  loading = input<boolean>(false);

  changeText = output<string | undefined>();

  onCreate = output<{ nativeEvent: Event, value: string | undefined }>();

  editingCancel = output<void>();

  sendButtonFillPositions = signal<GradientColorPositions>([0, 1]);

  editingState: Signal<MessageButtonSaveState>;

  isMessageValid: Signal<boolean>;

  tmpValue = signal<string>('');

  containerBackground = signal<string>('none');

  focused = signal<boolean>(false);

  scrolled = signal<boolean>(false);

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _resizeObserver: ResizeObserver;

  bounds = signal<ISize>({
    width: this.textarea()?.nativeElement?.offsetWidth || DEFAULT_TEXTAREA_SIZE,
    height: this.textarea()?.nativeElement?.offsetHeight || DEFAULT_TEXTAREA_SIZE,
  });

  private _onContainerResizeHandler = () => {
    const el = this.textarea()?.nativeElement as HTMLTextAreaElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.bounds.set({ width: el.offsetWidth || DEFAULT_TEXTAREA_SIZE, height: el.offsetHeight || DEFAULT_TEXTAREA_SIZE });
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    this.theme = toSignal(this._themeService.$theme);

    const $textarea = toObservable(this.textarea).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $textarea.pipe(
      takeUntilDestroyed(),
      tap(textarea => {
        this._resizeObserver.observe(textarea, { box: "border-box" });
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, 'focus').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
          }),
        );
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, 'blur').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(false);
          }),
        );
      }),
    ).subscribe();

    effect(() => {
      const bounds = this.bounds(), textarea = this.textarea()?.nativeElement as HTMLTextAreaElement;
      if (bounds && textarea) {
        textarea.style.overflow = bounds.height < MAX_TEXTAREA_HEIGHT ? HIDDEN : AUTO;

        this.scrolled.set(bounds.height >= MAX_TEXTAREA_HEIGHT);
      }
    });

    this.editingState = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0) ? MessageButtonSendStates.SEND : MessageButtonSendStates.CANCEL;
    });

    this.isMessageValid = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0);
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messageCreator);
        if (preset) {
          const focus = this.focused(), textarea = this.textarea()?.nativeElement, editor = this.editor()?.nativeElement;
          if (textarea) {
            textarea.style.color = preset.input.color;
          }
          if (editor) {
            editor.style.backgroundColor = preset.input.background;
            editor.style.outline = focus ? preset.input.outline : NONE;
          }
          this.containerBackground.set(preset.background);
        }
      }
    });
  }

  reset() {
    const textarea = this.textarea()?.nativeElement;
    if (textarea) {
      textarea.value = '';
    }
    this.tmpValue.set('');
  }

  onInputHandler(e: Event) {
    const textarea = this.textarea(), value = textarea?.nativeElement.value ?? '';
    this.tmpValue.set(value);
    this.changeText.emit(value);
  }

  onSaveHandler(e: Event, state: MessageButtonSaveState) {
    const tmpValue = this.tmpValue();
    if (tmpValue) {
      switch (state) {
        case MessageButtonSaveStates.SEND: {
          this.onCreate.emit({ nativeEvent: e, value: tmpValue });
          break;
        }
        case MessageButtonSaveStates.CANCEL: {
          e.stopImmediatePropagation();
          this.editingCancel.emit();
          break;
        }
      }
    }
  }

  onCancelEditingHandler(e: Event) {
    this.editingCancel.emit();
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
