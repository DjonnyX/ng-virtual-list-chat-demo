import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent, ButtonSubstarateStyle, ButtonSubstarateStyles } from '@shared/components/button';
import { GradientColor } from '@shared/types';
import { debounceTime, Subject, tap } from 'rxjs';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'];

@Component({
  selector: 'message-menu-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-menu-button.component.html',
  styleUrl: './message-menu-button.component.scss'
})
export class MessageMenuButtonComponent {
  click = output<Event>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  type = signal<ButtonSubstarateStyle>(ButtonSubstarateStyles.NONE);

  private _$click = new Subject<void>();
  protected $click = this._$click.asObservable();

  constructor() {
    const $click = this.$click;

    $click.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.type.set(ButtonSubstarateStyles.STROKE);
      }),
      debounceTime(500),
      tap(() => {
        this.type.set(ButtonSubstarateStyles.NONE);
      }),
    ).subscribe();
  }

  onClickHandler(e: Event) {
    this.click.emit(e);

    this._$click.next();
  }
}
