import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id, IVirtualListItem } from '@shared/components/x-virtual-list';
import { IMessageItemData } from '@shared/models/message';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IGetMessagesData } from './model/messages';
import { IMessage } from './model/message';

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
