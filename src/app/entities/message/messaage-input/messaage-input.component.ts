import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, computed, ElementRef, input, output, Signal, signal, viewChild } from '@angular/core';
import { LocaleSensitiveDirective } from '@shared/localization';
import { MessageSendButtonComponent } from '../message-send-button/message-send-button.component';
import { MessageButtonSendStates } from '../message-send-button/enums';
import { MessageButtonSaveState } from '../message-save-button/types';
import { GradientColorPositions } from '@shared/types';
import { MessageButtonSaveStates } from '../message-save-button/enums';

@Component({
  selector: 'x-messaage-input',
  imports: [LocaleSensitiveDirective, CdkTextareaAutosize, MessageSendButtonComponent],
  templateUrl: './messaage-input.component.html',
  styleUrl: './messaage-input.component.scss'
})
export class MessaageInputComponent {
  text = input<string>();

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  changeText = output<string | undefined>();

  edited = output<{ nativeEvent: Event, value: string | undefined }>();

  editingCancel = output<void>();

  sendButtonFillPositions = signal<GradientColorPositions>([0, 1]);

  editingState: Signal<MessageButtonSaveState>;

  isMessageValid: Signal<boolean>;

  isSaving: Signal<boolean>;

  tmpValue = signal<string>('');

  constructor() {
    this.editingState = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0) ? MessageButtonSendStates.SEND : MessageButtonSendStates.CANCEL;
    });

    this.isMessageValid = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0);
    });

    this.isSaving = computed(() => {
      return false;
    });
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
          this.edited.emit({ nativeEvent: e, value: tmpValue });
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
}
