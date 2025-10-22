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
    onPressHandler() {
        this.onPress.emit(true);
    }

    @HostListener('pointerup', ['$event'])
    @HostListener('pointerleave', ['$event'])
    onRelease() {
        this.onPress.emit(false);
    }
}
