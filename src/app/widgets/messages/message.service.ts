import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _$chatId = new BehaviorSubject<string | undefined>(undefined);
  readonly $chatId = this._$chatId.asObservable().pipe(
    distinctUntilChanged(),
  );

  constructor() { }

  changeChat(chatId: string) {
    this._$chatId.next(chatId);
  }
}
