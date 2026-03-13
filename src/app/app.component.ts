import { Component, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MediaService } from '@shared/directives/media';
import { ThemeNames, ThemeService } from '@shared/theming';
import { fromEvent, tap } from 'rxjs';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  providers: [ThemeService, MediaService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _themeService = inject(ThemeService);

  private _elementRef = inject(ElementRef);

  constructor() {
    this._themeService.name = ThemeNames[0];

    const el = this._elementRef.nativeElement;
    fromEvent<KeyboardEvent>(el, 'keydown', { passive: false, capture: false }).pipe(
      takeUntilDestroyed(),
      tap(e => {
        if (e.ctrlKey && e.code == 'KeyA') {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      })
    ).subscribe();
  }
}
