import { Injectable } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { Id, IVirtualListCollection } from '@shared/components/ng-virtual-list';
import { generateMessageCollection, IItemData } from '@mock/const/collection';
import { MessagesService } from './messages.service';

interface IDB {
    version: number;
    chats: {
        [chatId: string]: {
            version: number;
            messages?: IVirtualListCollection<IItemData>;
        }
    };
}

export const db: IDB = {
    version: 0,
    chats: {},
};

export const operations: {
    chatId: Id | undefined;
} = {
    chatId: undefined,
}

@Injectable({
    providedIn: 'root'
})
export class MessagesMockService implements MessagesService {
    constructor() { }

    getMessages(chatId: string): Observable<IVirtualListCollection<IItemData>> {
        operations.chatId = chatId;

        if (!db.chats[chatId]) {
            db.chats[chatId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.chats[chatId].messages)) {
            db.chats[chatId].messages = generateMessageCollection();
        }

        const data = db.chats[chatId].messages!;

        return of(data).pipe(
            delay(10 + (Math.random() * 500)),
        );
    }
    createMessage(chatId: string, message: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

    updateMessage(chatId: string, message: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

    deleteMessage(chatId: string, messageId: Id): Observable<void> {
        const items = db.chats[chatId].messages ?? [];
        const index = items.findIndex(({ id }) => id == messageId);
        if (index > -1) {
            return of(undefined).pipe(
                delay(10 + (Math.random() * 1000)),
                tap(() => {
                    const index = items.findIndex(({ id }) => id == messageId);
                    if (index > -1) {
                        items.splice(index, 1);
                    }
                }),
            );
        }
        return throwError(() => {
            return `Message by id is not found.`;
        });
    }
}
