import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeNames, ThemeService } from '@shared/theming';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  providers: [ThemeService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _themeService = inject(ThemeService);

  constructor() {
    const appResizeHandler = () => document.body.style.height = `${document.documentElement.clientHeight}px`;
    window.addEventListener('resize', appResizeHandler);
    appResizeHandler();

    this._themeService.name = ThemeNames[0];
  }
}
