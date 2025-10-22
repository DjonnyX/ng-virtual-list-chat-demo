import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IMessageItemData } from '@shared/models/message';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IGetMessagesData } from './model/messages';
import { IMessage } from './model/message';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesHttpService implements MessagesService {
  constructor() { }

  getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData> {
    throw new Error('Method not implemented.');
  }

  createMessage(chatId: Id, message: IVirtualListItem<IMessageItemData>): Observable<IVirtualListItem<IMessage>> {
    throw new Error('Method not implemented.');
  }

  updateMessage(chatId: Id, messageId: Id, message: Partial<Omit<IVirtualListItem<IMessageItemData>, 'id'>>): Observable<IVirtualListItem<IMessage>> {
    throw new Error('Method not implemented.');
  }

  deleteMessage(chatId: Id, messageId: Id): Observable<number | undefined> {
    throw new Error('Method not implemented.');
  }
}
