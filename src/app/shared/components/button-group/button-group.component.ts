import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, Subject, tap } from 'rxjs';
import { IButtonGroupItem } from './interfaces';
import { ButtonComponent } from '../button/button.component';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'x-button-group',
  imports: [ButtonComponent],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss'
})
export class ButtonGroupComponent {
  items = input.required<Array<IButtonGroupItem>>();

  onClick = output<IButtonGroupItem>();

  private _$click = new Subject<IButtonGroupItem>();
  protected $click = this._$click.asObservable();

  constructor() {
    const $click = this.$click;

    $click.pipe(
      takeUntilDestroyed(),
      delay(300),
      takeUntilDestroyed(),
      tap(e => {
        this.onClick.emit(e);
      }),
    ).subscribe();
  }

  onButtonClickHandler(item: IButtonGroupItem) {
    this._$click.next(item);
  }
}
