import { Injectable } from '@angular/core';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { Id, IVirtualListCollection, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesHttpService implements MessagesService {
  constructor() { }

  getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IVirtualListCollection<any>> {
    throw new Error('Method not implemented.');
  }

  createMessage(chatId: Id, message: IVirtualListItem<any>): Observable<IVirtualListItem<any>> {
    throw new Error('Method not implemented.');
  }

  updateMessage(chatId: Id, messageId: Id, message: Partial<IVirtualListItem<any>>): Observable<IVirtualListItem<any>> {
    throw new Error('Method not implemented.');
  }

  deleteMessage(chatId: Id, messageId: Id): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
