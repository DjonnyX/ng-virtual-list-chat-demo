import { Observable } from "rxjs";
import { Id, IVirtualListCollection } from "@shared/components/ng-virtual-list";
import { IItemData } from "@mock/const/collection";

export interface IMessagesChunkParams {
    number?: number;
    size?: number;
}

export abstract class MessagesService {
    abstract getMessages(chatId: string, chunk?: IMessagesChunkParams): Observable<IVirtualListCollection<IItemData>>;

    abstract createMessage(chatId: string, message: any): Observable<any>;

    abstract updateMessage(chatId: string, message: any): Observable<any>;

    abstract deleteMessage(chatId: string, messageId: Id): Observable<void>;
}