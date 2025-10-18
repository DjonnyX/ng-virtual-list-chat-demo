import {
    Directive,
    HostListener,
    output,
} from '@angular/core';

@Directive({
    selector: '[press]',
})
export class PressDirective {
    onPress = output<boolean>();

    @HostListener('pointerdown', ['$event'])
    onPressHandler(event: PointerEvent) {
        this.onPress.emit(true);
    }

    @HostListener('pointerup', ['$event'])
    @HostListener('pointerleave', ['$event'])
    onRelease(event: PointerEvent) {
        this.onPress.emit(false);
    }
}
