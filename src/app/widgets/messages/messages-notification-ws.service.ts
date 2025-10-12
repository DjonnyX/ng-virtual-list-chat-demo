import { Injectable } from '@angular/core';
import { MessagesNotificationService } from './messages-notification.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesNotificationWSService implements MessagesNotificationService {
  /**
   * version
   */
  private _$messages = new Subject<number>;
  readonly $messages = this._$messages.asObservable();

  /**
   * userId
   */
  private _$writing = new Subject<number>;
  readonly $writing = this._$writing.asObservable();

  constructor() { }
}
