import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'message-group',
  imports: [CommonModule],
  templateUrl: './message-group.component.html',
  styleUrl: './message-group.component.scss'
})
export class MessageGroupComponent {
  text = input<string>();

  classes = input<{ [className: string]: boolean; }>();

  collapsed = input<boolean>(false);
}
