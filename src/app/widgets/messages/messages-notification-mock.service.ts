import { Injectable } from '@angular/core';
import { delay, from, interval, of, Subject, switchMap, tap } from 'rxjs';
import { MessagesNotificationService } from './messages-notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { generateMessage, generateWriteIndicator } from '@mock/utils/collection';
import { db, operations } from './messages-mock.service';

@Injectable({
    providedIn: 'root'
})
export class MessagesNotificationMockService implements MessagesNotificationService {
    private _$messages = new Subject<number>;
    readonly $messages = this._$messages.asObservable();

    private _nextIndex = 10000;

    constructor() {
        of(true).pipe(
            takeUntilDestroyed(),
            delay(2000),
            switchMap(() => from(interval(2000)).pipe(
                switchMap(() => this.write()),
            )),
        ).subscribe();
    }

    private write() {
        const msg = generateMessage(this._nextIndex);
        this._nextIndex++;
        return of(msg).pipe(
            // tap(() => {
            //     const writeIndicator = generateWriteIndicator(this._nextIndex);
            //     this._nextIndex++;
            //     const database = db, dbOperations = operations,
            //         collection = database.chats[dbOperations.chatId!]?.messages;

            //     if (collection) {
            //         collection.push(writeIndicator);
            //     }
            //     const v = database.chats[dbOperations.chatId!].version += 1;
            //     this._$messages.next(v);
            // }),
            // delay(500),
            tap(() => {
                const database = db, dbOperations = operations,
                    collection = database.chats[dbOperations.chatId!]?.messages;

                if (collection) {
                    collection.push(msg);
                    const v = database.chats[dbOperations.chatId!].version += 1;
                    this._$messages.next(v);
                }
            }),
        );
    }
}
