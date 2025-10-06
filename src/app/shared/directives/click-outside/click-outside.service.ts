import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClickOutsideService {
    private _$onClick = new Subject<Event>();
    $onClick = this._$onClick.asObservable();

    public activeTarget: HTMLElement | null | undefined;

    constructor() {
        fromEvent(document.body, 'click').pipe(
            takeUntilDestroyed(),
            tap(e => {
                this._$onClick.next(e);
            }),
        ).subscribe();
    }
}
