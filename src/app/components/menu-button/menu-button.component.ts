import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  imports: [],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent {
  button = viewChild<ElementRef<HTMLButtonElement>>('button');

  opened = input<boolean>(false);

  click = output<void>();

  constructor() {
    effect(() => {
      const opened = this.opened(), button = this.button();
      if (opened) {
        button?.nativeElement.classList.add('active');
      } else {
        button?.nativeElement.classList.remove('active');
      }
    });
  }

  onClickHandler(e: Event) {
    e.stopImmediatePropagation();

    this.click.emit();
  }
}
