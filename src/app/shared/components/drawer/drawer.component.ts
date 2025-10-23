import { Component, computed, ElementRef, inject, input, output, Signal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleSensitiveDirective, LocalizationService } from '@shared/localization';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export enum DockMode {
  LEFT = 'left',
  RIGHT = 'right',
  NONE = 'none',
}

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export type TDockMode = DockMode.LEFT | DockMode.RIGHT | DockMode.NONE | 'left' | 'right' | 'none';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'app-drawer',
  imports: [CommonModule, LocaleSensitiveDirective],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DrawerComponent {
  private _elementRef = inject(ElementRef<HTMLDivElement>);

  container = viewChild<ElementRef<HTMLDivElement>>('container');

  dock = input<TDockMode>(DockMode.NONE);

  close = output<void>();

  dockLeftSize = input<number>(140);

  dockRightSize = input<number>(140);

  styles: Signal<any>;

  locale: Signal<string | undefined>;

  protected _bounds = signal<DOMRect | null>(null);

  private _resizeObserver: ResizeObserver | null = null;

  private _localizationService = inject(LocalizationService);

  private _onResizeHandler = () => {
    this._bounds.set(this._elementRef?.nativeElement?.getBoundingClientRect() ?? null);
  }

  constructor() {
    this.locale = toSignal(this._localizationService.$locale);

    this.styles = computed(() => {
      const loc = this.locale(), langTextDir = this._localizationService.textDirection, width = this._bounds()?.width ?? 0, dockMode = this.dock(), dockLeftSize = this.dockLeftSize(),
        dockRightSize = this.dockRightSize(),
        result = {
          'grid-template-columns': langTextDir === 'rtl' ? `${dockLeftSize}px ${width}px ${dockRightSize}px` : `${dockLeftSize}px ${width}px ${dockRightSize}px`,
          'transform': langTextDir === 'rtl'
            ?
            (dockMode === 'left' ? `translate3d(0, 0, 0)` : dockMode === 'right'
              ? `translate3d(${-(dockLeftSize + dockRightSize)}px, 0, 0)` : `translate3d(${dockLeftSize}px, 0, 0)`)
            :
            (dockMode === 'left' ? `translate3d(0, 0, 0)` : dockMode === 'right'
              ? `translate3d(${-(dockLeftSize + dockRightSize)}px, 0, 0)` : `translate3d(${-dockLeftSize}px, 0, 0)`),
        };
      return result;
    });
  }

  ngAfterViewInit(): void {
    const containerEl = this._elementRef;
    if (containerEl) {
      this._resizeObserver = new ResizeObserver(this._onResizeHandler);
      this._resizeObserver.observe(containerEl.nativeElement);

      this._onResizeHandler();

      const container = this.container();
      if (container) {
        container.nativeElement.style.transition = 'transform 0.1s ease-in-out';
      }
    }
  }

  onOverlayClick(e: Event) {
    this.close.emit();
  }
}
