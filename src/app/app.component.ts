import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeNames, ThemeService } from '@shared/theming';

const ROOT_VAR_APP_HEIGHT = '--app-height';

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
    const appResizeHandler = () => document.documentElement.style.setProperty(ROOT_VAR_APP_HEIGHT, `${document.documentElement.clientHeight}px`);
    window.addEventListener('resize', appResizeHandler);
    appResizeHandler();

    this._themeService.name = ThemeNames[0];
  }
}
