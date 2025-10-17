import { Observable } from "rxjs";
import { Id, IVirtualListItem } from "@shared/components/ng-virtual-list";
import { IMessageItemData } from "@shared/models/message";
import { IGetMessagesData } from "./model/messages";
import { IMessage } from "./model/message";

export interface IMessagesChunkParams {
    number?: number;
    size?: number;
}

export abstract class MessagesService {
    abstract getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData>;

    abstract createMessage(chatId: Id, message: IVirtualListItem<IMessageItemData>): Observable<IVirtualListItem<IMessage>>;

    abstract updateMessage(chatId: Id, messageId: Id, message: Partial<Omit<IVirtualListItem<IMessageItemData>, 'id'>>): Observable<IVirtualListItem<IMessage>>;

    abstract deleteMessage(chatId: Id, messageId: Id): Observable<number | undefined>;
}