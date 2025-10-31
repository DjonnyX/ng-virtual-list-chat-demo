import { Observable } from "rxjs";
import { Id, IVirtualListItem } from "@shared/components/x-virtual-list";
import { IMessageItemData } from "@shared/models/message";
import { IGetMessagesData } from "./model/messages";
import { IMessage } from "./model/message";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessagesChunkParams {
    number?: number;
    size?: number;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export abstract class MessagesService {
    abstract getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData>;

    abstract createMessage(chatId: Id, message: IVirtualListItem<IMessageItemData>): Observable<IVirtualListItem<IMessage>>;

    abstract updateMessage(chatId: Id, messageId: Id, message: Partial<Omit<IVirtualListItem<IMessageItemData>, 'id'>>): Observable<IVirtualListItem<IMessage>>;

    abstract deleteMessage(chatId: Id, messageId: Id, params: { deleteAll: boolean; }): Observable<number | undefined>;
}