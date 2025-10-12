import { Injectable } from '@angular/core';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IItemData } from '@mock/const/collection';
import { Id, IVirtualListCollection } from '@shared/components/ng-virtual-list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesHttpService implements MessagesService {
  constructor() { }

  getMessages(chatId: string, chunk?: IMessagesChunkParams): Observable<IVirtualListCollection<IItemData>> {
    throw new Error('Method not implemented.');
  }

  createMessage(chatId: string, message: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  updateMessage(chatId: string, message: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  deleteMessage(chatId: string, messageId: Id): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
