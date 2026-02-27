import {
    Directive,
    ElementRef,
    inject,
    output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MOUSE_DOWN, MOUSE_LEAVE, MOUSE_UP, TOUCH_END, TOUCH_LEAVE, TOUCH_START } from '@shared/components/ng-virtual-list//const';
import { fromEvent, tap } from 'rxjs';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
    selector: '[press]',
})
export class PressDirective {
    onPress = output<boolean>();

    private _elementRef = inject(ElementRef<HTMLElement>);

    constructor() {
        fromEvent<MouseEvent>(this._elementRef.nativeElement, MOUSE_DOWN).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(true);
            }),
        ).subscribe();

        fromEvent<TouchEvent>(this._elementRef.nativeElement, TOUCH_START).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(true);
            }),
        ).subscribe();

        fromEvent<MouseEvent>(this._elementRef.nativeElement, MOUSE_UP).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(false);
            }),
        ).subscribe();

        fromEvent<MouseEvent>(this._elementRef.nativeElement, MOUSE_LEAVE).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(false);
            }),
        ).subscribe();

        fromEvent<TouchEvent>(this._elementRef.nativeElement, TOUCH_END).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(false);
            }),
        ).subscribe();

        fromEvent<TouchEvent>(this._elementRef.nativeElement, TOUCH_LEAVE).pipe(
            takeUntilDestroyed(),
            tap(e => {
                this.onPress.emit(false);
            }),
        ).subscribe();
    }
}
