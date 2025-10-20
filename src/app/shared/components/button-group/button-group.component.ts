import { Component, input, output } from '@angular/core';
import { IButtonGroupItem } from './interfaces';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'x-button-group',
  imports: [ButtonComponent],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss'
})
export class ButtonGroupComponent {
  items = input.required<Array<IButtonGroupItem>>();

  onClick = output<IButtonGroupItem>();

  onButtonClickHandler(item: IButtonGroupItem) {
    this.onClick.emit(item);
  }
}
