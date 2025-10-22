import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { IDialogData } from './interfaces';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
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
