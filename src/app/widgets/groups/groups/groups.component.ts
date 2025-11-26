import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, filter, of, switchMap, tap, throwError } from 'rxjs';
import { GroupsLoadingIndicatorComponent } from '@entities/groups';
import { Id, IVirtualListCollection, IVirtualListItem } from '@shared/components/x-virtual-list';
import { XVirtualListComponent } from '@shared/components';
import { environment } from '@environments/environment';
import { GroupsService } from '../groups.service';
import { GroupsMockService } from '../groups-mock.service';
import { GroupsWebsocketService } from '../groups-websocket.service';
import { validateCollection } from './utils/validate-collection';
import { ClickOutsideDirective, StaticClickDirective } from '@shared/directives';
import { LocaleSensitiveDirective } from '@shared/localization';

const DEFAULT_MAX_DISTANCE = 40;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-groups',
  imports: [
    CommonModule, XVirtualListComponent, GroupsLoadingIndicatorComponent, ClickOutsideDirective, StaticClickDirective,
    LocaleSensitiveDirective,
  ],
  providers: [
    { provide: GroupsService, useClass: environment.useMock ? GroupsMockService : GroupsWebsocketService },
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  protected _list = viewChild('list', { read: XVirtualListComponent });

  projectId = input<string>('');

  scrollStartOffset = input<number>(0);

  select = output<IVirtualListItem>();

  close = output<void>();

  collection = signal<IVirtualListCollection<any>>([]);

  isLoading = signal<boolean>(true);

  selectedId = signal<Id | undefined>(undefined);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  private _service = inject(GroupsService);

  constructor() {
    effect(() => {
      const collection = this.collection();
      if (collection.length) {
        for (let i = 0, l = collection.length; i < l; i++) {
          const item = collection[0];
          if (item) {
            this.select.emit(item);
            this.selectedId.set(item.id);
          }
          break;
        }
      }
    })

    const $loading = toObservable(this.isLoading), $virtualList = toObservable(this._list).pipe(
      takeUntilDestroyed(),
      filter(list => !!list),
    );

    combineLatest([$virtualList, $loading]).pipe(
      takeUntilDestroyed(),
      filter(([, loading]) => !loading),
      tap(([list]) => {
        list.host.nativeElement.style.opacity = 1;
      }),
    ).subscribe();

    const $projectId = toObservable(this.projectId).pipe(
      filter(v => v !== undefined),
    );

    $projectId.pipe(
      takeUntilDestroyed(),
      tap(() => {
        const collection = this.collection();
        if (!collection.length) {
          this.isLoading.set(true);
        }
      }),
      switchMap(groupId => {
        return this._service.getGroups(groupId);
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get group chunk error: ${err}`;
        });
      }),
      tap(items => {
        validateCollection(items);

        // const current = this.collection(),
        //   collection = appendItems(current, items);

        // fillConfigMap(this.collectionConfigMap(), items);

        this.collection.set(items);
      }),
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error(err);
        this.isLoading.set(false);
        return of(undefined);
      }),
    ).subscribe();
  }

  onGroupClickHandler(item: IVirtualListItem<any>) {
    if (item) {
      this.select.emit(item);
    }
    this.close.emit();
  }

  onClickOutside() {
    this.close.emit();
  }

  onClickHandler(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
