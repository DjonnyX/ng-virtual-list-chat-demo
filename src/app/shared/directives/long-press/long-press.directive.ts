import { DestroyRef, Directive, ElementRef, inject, input, Input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, race, timer } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

const DEFAULT_DURATION = 3000;

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
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

    onLongPressActive = output<boolean>();

    private _elementRef = inject(ElementRef<HTMLElement>);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const $disabled = toObservable(this.longPressDisabled).pipe(
            filter(v => !!v),
        ),
            $pressed = fromEvent(this._elementRef.nativeElement, 'pointerdown'),
            $cancel = race([
                fromEvent(window, 'pointerup'),
                fromEvent(window, 'pointermove'),
                fromEvent(window, 'pointerleave'),
            ]),
            $release = fromEvent(this._elementRef.nativeElement, 'pointerup');

        $pressed.pipe(
            takeUntilDestroyed(),
            switchMap(() => {
                return timer(this._duration).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil($disabled),
                    takeUntil($cancel),
                    tap(() => {
                        this.onLongPressActive.emit(true);
                    }),
                    switchMap(() => {
                        return $release.pipe(
                            takeUntilDestroyed(this._destroyRef),
                            takeUntil($disabled),
                            takeUntil($cancel.pipe(
                                takeUntilDestroyed(this._destroyRef),
                                tap(() => {
                                    this.onLongPressActive.emit(false);
                                }),
                            )),
                            delay(1),
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
