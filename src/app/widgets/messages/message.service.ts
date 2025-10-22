import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { NgVirtualListComponent } from '@shared/components';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _virtualList: NgVirtualListComponent | undefined;
  set virtualList(v: NgVirtualListComponent | undefined) {
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
    if (this._virtualList) {
      this._virtualList.stopSnappingScrollToEnd();
    }
  }
}
