import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-messages-typing-indicator',
  imports: [CommonModule],
  templateUrl: './messages-typing-indicator.component.html',
  styleUrl: './messages-typing-indicator.component.scss'
})
export class MessagesTypingIndicatorComponent {
  classes = input.required<{ [className: string]: boolean; }>();
}
