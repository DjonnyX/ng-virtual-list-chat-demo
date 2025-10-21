import { DestroyRef, Directive, HostListener, inject, input, Input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, timer } from 'rxjs';
import { delay, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

const DEFAULT_DURATION = 3000;

@Directive({
    selector: '[longPress]',
})
export class LongPressDirective {
    private _duration = DEFAULT_DURATION;

    @Input('longPress')
    set duration(v: number | string) {
        this._duration = v ? Number(v) : DEFAULT_DURATION;
    }

    longPressDisabled = input<boolean>(false);

    onLongPress = output<void>();

    onLongPressActive = output<void>();

    private _$pressed = new Subject<PointerEvent>();
    private _$cancel = new Subject<PointerEvent>();

    @HostListener('pointerdown', ['$event'])
    onPress(e: PointerEvent) {
        if (this.longPressDisabled()) {
            return;
        }
        this._$pressed.next(e);
    }

    @HostListener('pointerup', ['$event'])
    @HostListener('pointerleave', ['$event'])
    onRelease(e: PointerEvent) {
        this._$cancel.next(e);
    }

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const $pressed = this._$pressed.asObservable(),
            $cancel = this._$cancel.asObservable();

        $pressed.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                return timer(this._duration).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil($cancel),
                    tap(() => {
                        this.onLongPressActive.emit();
                    }),
                    switchMap(() => {
                        return $cancel.pipe(
                            takeUntilDestroyed(this._destroyRef),
                            take(1),
                            delay(1),
                            takeUntilDestroyed(this._destroyRef),
                            tap(() => {
                                this.onLongPress.emit();
                            }),
                        );
                    }),
                );
            }),
        ).subscribe();
    }
}
