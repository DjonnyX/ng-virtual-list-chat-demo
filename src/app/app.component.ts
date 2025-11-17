import { Component, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { ThemeNames, ThemeService } from '@shared/theming';
import { fromEvent, take, tap } from 'rxjs';

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

  private _elementRef = inject(ElementRef);

  constructor() {
    const appResizeHandler = () => document.body.style.height = `${window.innerHeight}px`;
    window.addEventListener('resize', appResizeHandler);
    window.addEventListener('scroll', appResizeHandler);
    appResizeHandler();

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
