import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { IDialogData } from './interfaces';

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
export class DialogService {
  private _dialog = inject(Dialog);

  open<A = any>(data: IDialogData) {
    const dialogRef = this._dialog.open<A, IDialogData, DialogComponent>(DialogComponent, {
      autoFocus: false,
      data,
    });

    return dialogRef.closed;
  }
}
