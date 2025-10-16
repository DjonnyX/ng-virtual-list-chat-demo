import { Observable } from "rxjs";
import { Id, IVirtualListCollection, IVirtualListItem } from "@shared/components/ng-virtual-list";
import { IMessageItemData } from "@shared/models/message";

export interface IMessagesChunkParams {
    number?: number;
    size?: number;
}

export abstract class MessagesService {
    abstract getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IVirtualListCollection<IMessageItemData>>;

    abstract createMessage(chatId: Id, messageId: Id, message: IVirtualListItem<any>): Observable<IVirtualListItem<any>>;

    abstract updateMessage(chatId: Id, messageId: Id, message: Partial<IVirtualListItem<any>>): Observable<IVirtualListItem<any>>;

    abstract deleteMessage(chatId: Id, messageId: Id): Observable<void>;
}