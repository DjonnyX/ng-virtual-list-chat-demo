import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const appResizeHandler = () => document.documentElement.style.setProperty('--app-height', `${document.documentElement.clientHeight}px`);
    window.addEventListener('resize', appResizeHandler);
    appResizeHandler();
  }
}
