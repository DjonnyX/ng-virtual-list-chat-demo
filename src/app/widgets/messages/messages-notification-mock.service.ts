import { Injectable } from '@angular/core';
import { concatMap, delay, from, interval, of, Subject, switchMap, tap } from 'rxjs';
import { MessagesNotificationService } from './messages-notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { generateMessage, generateWriteIndicator } from '@mock/utils/collection';
import { db, operations } from './messages-mock.service';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Injectable({
    providedIn: 'root'
})
export class MessagesNotificationMockService implements MessagesNotificationService {
    /**
     * version
     */
    private _$messages = new Subject<number>;
    readonly $messages = this._$messages.asObservable();

    /**
     * userId
     */
    private _$typing = new Subject<number>;
    readonly $typing = this._$typing.asObservable();

    constructor() {
        of(true).pipe(
            takeUntilDestroyed(),
            delay(2000),
            switchMap(() => from(interval(3000)).pipe(
                tap(() => this.startWrite()),
                delay(1500),
                concatMap(() => this.write()),
            )),
        ).subscribe();
    }

    private startWrite() {
        this._$typing.next(1); // emits userId
    }

    private write() {
        const msg = generateMessage();
        return of(msg).pipe(
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
