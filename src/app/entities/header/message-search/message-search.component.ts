import { Component, DestroyRef, ElementRef, inject, output, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, filter, fromEvent, interval, map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

const INTERVAL_COUNT = 89, INTERVAL_TIMEOUT = 100;

@Component({
  selector: 'message-search',
  imports: [FormsModule],
  templateUrl: './message-search.component.html',
  styleUrl: './message-search.component.scss'
})
export class MessageSearchComponent {
  input = viewChild<ElementRef<HTMLInputElement>>('input');

  indicator = viewChild<ElementRef<HTMLDivElement>>('indicator');

  search = output<string>();

  private _$reset = new Subject<void>();
  readonly $reset = this._$reset.asObservable();

  searchText = '';

  private _destroyRef = inject(DestroyRef);

  constructor() {
    const $input = toObservable(this.input),
      $indicator = toObservable(this.indicator),
      $reset = this.$reset;

    const $blur = $input.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(input => {
        return fromEvent(input.nativeElement, 'blur').pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            const inputElement = input?.nativeElement,
              indicatorElement = this.indicator()?.nativeElement;
            if (inputElement) {
              // reset
              inputElement.value = '';
              inputElement.blur();
              this.search.emit('');
            }
            if (indicatorElement) {
              indicatorElement.style.width = `0%`;
            }
          }),
        );
      }),
    );

    combineLatest([$input, $indicator]).pipe(
      takeUntilDestroyed(),
      map(([input, indicator]) => ({ input, indicator })),
      filter(({ input, indicator }) => !!input && !!indicator),
      switchMap(({ input, indicator }) => {
        return $reset.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(() => {
            const indicatorElement = indicator?.nativeElement;
            if (indicatorElement) {
              indicatorElement.style.width = `0%`;
            }
            return interval(INTERVAL_TIMEOUT).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($blur),
              take(INTERVAL_COUNT + 1),
              tap((count) => {
                if (count === INTERVAL_COUNT) {
                  const inputElement = input?.nativeElement,
                    indicatorElement = indicator?.nativeElement;
                  if (inputElement) {
                    // reset
                    inputElement.value = '';
                    inputElement.blur();
                    this.search.emit('');
                  }
                  if (indicatorElement) {
                    indicatorElement.style.width = '0%';
                  }
                } else {
                  const w = (count / INTERVAL_COUNT) * 100;
                  const indicatorElement = indicator?.nativeElement;
                  if (indicatorElement) {
                    indicatorElement.style.width = `${w}%`;
                  }
                }
              }),
            );
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
