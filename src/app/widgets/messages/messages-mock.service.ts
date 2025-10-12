import { Injectable } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { Id, IVirtualListCollection } from '@shared/components/ng-virtual-list';
import { generateMessageCollection, IItemData } from '@mock/const/collection';
import { IMessagesChunkParams, MessagesService } from './messages.service';

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
};

const DEFAULT_CHUNK_NUMBER = 1,
    DEFAULT_CHUNK_SIZE = 100;


const sortByDateTime = (a: IItemData, b: IItemData) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return 0;
}

@Injectable({
    providedIn: 'root'
})
export class MessagesMockService implements MessagesService {
    constructor() { }

    getMessages(chatId: string, chunk?: IMessagesChunkParams): Observable<IVirtualListCollection<IItemData>> {
        operations.chatId = chatId;

        if (!db.chats[chatId]) {
            db.chats[chatId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.chats[chatId].messages)) {
            db.chats[chatId].messages = [];
        }
        const number = chunk?.number ?? DEFAULT_CHUNK_NUMBER, size = chunk?.size ?? DEFAULT_CHUNK_SIZE,
            result: IVirtualListCollection<IItemData> = [];

        let listChunk: IVirtualListCollection<IItemData>;
        if (chunk) {
            listChunk = generateMessageCollection(number, size);
            if (number === 1) {
                db.chats[chatId].messages = [...listChunk];
            } else {
                db.chats[chatId].messages.push(...listChunk);
            }
            db.chats[chatId].messages = db.chats[chatId].messages.sort(sortByDateTime);
        } else {
            listChunk = [];
            const dbMessages = db.chats[chatId].messages;
            for (let i = dbMessages.length - size, l = dbMessages.length; i < l; i++) {
                listChunk.push(dbMessages[i]);
            }
        }

        for (let i = 0, l = size; i < l; i++) {
            const msg = listChunk[i];
            result.push(msg);
        }
        return of(result).pipe(
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
