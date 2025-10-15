import { CommonModule } from '@angular/common';
import { Component, computed, input, output, Signal, signal } from '@angular/core';
import { ButtonComponent, ButtonSubstarateStyle, ButtonSubstarateStyles } from '@shared/components/button';
import { GradientColor } from '@shared/types';
import { Subject } from 'rxjs';
import { MessageButtonSaveState } from './types';
import { MessageButtonSaveStates } from './enums';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'];

@Component({
  selector: 'message-save-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-save-button.component.html',
  styleUrl: './message-save-button.component.scss'
})
export class MessageSaveButtonComponent {
  onClick = output<Event>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  type: Signal<ButtonSubstarateStyle>;

  loading = input<boolean>(false);

  valid = input<boolean>(false);

  state = input<MessageButtonSaveState>(MessageButtonSaveStates.CANCEL);

  disabled: Signal<boolean>;

  classes: Signal<{ [name: string]: boolean }>;

  private _$click = new Subject<void>();
  protected $click = this._$click.asObservable();

  constructor() {
    this.type = computed(() => {
      const loading = this.loading();
      return loading ? ButtonSubstarateStyles.STROKE : ButtonSubstarateStyles.NONE;
    });

    this.classes = computed(() => {
      const state = this.state(), disabled = this.disabled();
      return { [state]: true, disabled };
    });

    this.disabled = computed(() => {
      const state = this.state(), valid = this.valid(), loading = this.loading();
      return (state === MessageButtonSaveStates.SEND) && (!valid || loading);
    });
  }

  onClickHandler(e: Event) {
    const disabled = this.disabled();
    if (disabled) {
      e.stopImmediatePropagation();
      return;
    }
    this.onClick.emit(e);
    this._$click.next();
  }
}
