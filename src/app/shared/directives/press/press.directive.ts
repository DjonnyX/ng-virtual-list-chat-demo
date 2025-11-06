import {
    Directive,
    HostListener,
    output,
} from '@angular/core';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
    selector: '[press]',
})
export class PressDirective {
    onPress = output<boolean>();

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    onPressHandler() {
        this.onPress.emit(true);
    }

    @HostListener('mouseup', ['$event'])
    @HostListener('mouseleave', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchleave', ['$event'])
    onRelease() {
        this.onPress.emit(false);
    }
}
