import { Injectable } from '@angular/core';
import { MessagesNotificationService } from './messages-notification.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesNotificationWSService implements MessagesNotificationService {
  private _$messages = new Subject<number>;
  readonly $messages = this._$messages.asObservable();

  constructor() { }
}
