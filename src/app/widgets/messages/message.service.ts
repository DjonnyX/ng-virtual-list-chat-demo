import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { XVirtualListComponent } from '@shared/components';

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
export class MessageService {
  private _virtualList: XVirtualListComponent | undefined;
  set virtualList(v: XVirtualListComponent | undefined) {
    if (this._virtualList !== v) {
      this._virtualList = v;
    }
  }

  private _$chatId = new BehaviorSubject<string | undefined>(undefined);
  readonly $chatId = this._$chatId.asObservable().pipe(
    distinctUntilChanged(),
  );

  constructor() { }

  changeChat(chatId: string) {
    this._$chatId.next(chatId);
  }

  stopSnappingScrollToEnd() {
    // if (this._virtualList) {
    //   this._virtualList.stopSnappingScrollToEnd();
    // }
  }
}
