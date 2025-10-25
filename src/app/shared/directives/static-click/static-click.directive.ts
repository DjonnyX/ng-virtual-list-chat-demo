import { DestroyRef, Directive, HostListener, inject, input, Input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, timer } from 'rxjs';
import { delay, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
interface IPosition { x: number; y: number; }

const DEFAULT_MAX_DISTANCE = 40;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Directive({
    selector: '[staticClick]',
})
export class StaticClickDirective {
    private _maxDistance = DEFAULT_MAX_DISTANCE;

    @Input('maxStaticClickDistance')
    set maxDistance(v: number | string) {
        this._maxDistance = v ? Number(v) : DEFAULT_MAX_DISTANCE;
    }

    onStaticClick = output<void>();

    private _pressed: boolean = false;
    private _$pressed = new Subject<PointerEvent>();
    private _$released = new Subject<PointerEvent>();
    private _$cancel = new Subject<PointerEvent>();
    private _startPosition: IPosition = { x: 0, y: 0 };

    @HostListener('pointerdown', ['$event'])
    onPress(e: PointerEvent) {
        this._startPosition.x = e.clientX;
        this._startPosition.y = e.clientY;
        this._pressed = true;
        this._$pressed.next(e);
    }

    @HostListener('pointerup', ['$event'])
    onRelease(e: PointerEvent) {
        this._pressed = false;
        this._$released.next(e);
    }

    @HostListener('pointerleave', ['$event'])
    onLeave(e: PointerEvent) {
        this._$cancel.next(e);
    }

    @HostListener('pointermove', ['$event'])
    onMove(e: PointerEvent) {
        if (this._pressed) {
            const x = e.clientX, y = e.clientY,
                dist = Math.sqrt(Math.pow(Math.abs(this._startPosition.x - x), 2) + Math.pow(Math.abs(this._startPosition.y - y), 2));
            if (dist > this._maxDistance) {
                this._$cancel.next(e);
                return;
            }
        }
    }

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const $pressed = this._$pressed.asObservable(),
            $released = this._$released.asObservable(),
            $cancel = this._$cancel.asObservable();

        $pressed.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                return $released.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil($cancel),
                    take(1),
                    tap(() => {
                        this.onStaticClick.emit();
                    }),
                );
            }),
        ).subscribe();
    }
}
