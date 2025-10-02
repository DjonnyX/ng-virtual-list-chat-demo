import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject, tap } from 'rxjs';
import { IItemData } from '../const/collection';

@Injectable({
    providedIn: 'root'
})
export class ClickOutsideService {
    private _$onClick = new Subject<Event>();
    $onClick = this._$onClick.asObservable();

    public activeTarget: HTMLElement | null | undefined;
    public activeItem: IItemData | null | undefined;

    constructor() {
        fromEvent(document.body, 'click').pipe(
            takeUntilDestroyed(),
            tap(e => {
                this._$onClick.next(e);
            }),
        ).subscribe();
    }
}
