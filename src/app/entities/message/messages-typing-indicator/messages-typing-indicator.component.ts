import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'messages-typing-indicator',
  imports: [CommonModule],
  templateUrl: './messages-typing-indicator.component.html',
  styleUrl: './messages-typing-indicator.component.scss'
})
export class MessagesTypingIndicatorComponent {
  classes = input.required<{ [className: string]: boolean; }>();
}
