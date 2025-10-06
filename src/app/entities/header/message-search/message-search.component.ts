import { Component, DestroyRef, ElementRef, inject, output, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, filter, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'message-search',
  imports: [FormsModule],
  templateUrl: './message-search.component.html',
  styleUrl: './message-search.component.scss'
})
export class MessageSearchComponent {
  input = viewChild<ElementRef<HTMLInputElement>>('input');

  search = output<string>();

  private _$reset = new Subject<void>();
  readonly $reset = this._$reset.asObservable();

  searchText = '';

  private _destroyRef = inject(DestroyRef);

  constructor() {
    const $input = toObservable(this.input),
      $reset = this.$reset;

    $input.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(input => {
        return $reset.pipe(
          takeUntilDestroyed(this._destroyRef),
          debounceTime(5000),
          tap(() => {
            input.nativeElement.value = '';
            input.nativeElement.blur();
            this.search.emit('');
          }),
        )
      })
    ).subscribe();
  }

  onSearchHandler() {
    this.search.emit(this.searchText);
    this._$reset.next();
  }
}
