import {
    DestroyRef,
    Directive, ElementRef, inject, input, OnInit, output, signal,
} from '@angular/core';
import { ClickOutsideService } from './click-outside.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';
import { IItemData } from '../const/collection';
import { Id } from 'ng-virtual-list';

@Directive({
    selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnInit {
    onClickOutside = output<Event>();

    onClick = output<Event>();

    onOutsideClose = output<{ target: EventTarget; item: IItemData & { id: Id }; }>();

    clickOutsideItem = input<IItemData>();

    private initialized = signal(false);

    private _service = inject(ClickOutsideService);

    private _elementRef = inject(ElementRef<HTMLElement>);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const element: HTMLElement = this._elementRef.nativeElement, $initialized = toObservable(this.initialized);

        $initialized.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                const item = this.clickOutsideItem();
                if (this._service.activeTarget && (this._service.activeItem as any)?.id !== (item as any)?.id) {
                    this.onOutsideClose.emit({
                        target: this._service.activeTarget,
                        item: this._service.activeItem as any,
                    });
                }
                this._service.activeTarget = element;
                this._service.activeItem = item;
                return this._service.$onClick.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {
                        const element: HTMLElement = this._elementRef.nativeElement;
                        if (e.target === element) {
                            this.onClick.emit(e);
                        } else {
                            this.onClickOutside.emit(e);
                        }
                    }),
                );
            }),
        ).subscribe();
    }

    ngOnInit(): void {
        this.initialized.set(true);
    }
}
