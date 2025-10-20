import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeNames, ThemeService } from '@shared/theming';

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
