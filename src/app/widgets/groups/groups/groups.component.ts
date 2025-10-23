import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, filter, of, switchMap, tap, throwError } from 'rxjs';
import { GroupsLoadingIndicatorComponent } from '@entities/groups';
import { Id, IVirtualListCollection, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { NgVirtualListComponent } from '@shared/components';
import { environment } from '@environments/environment';
import { GroupsService } from '../groups.service';
import { GroupsMockService } from '../groups-mock.service';
import { GroupsWebsocketService } from '../groups-websocket.service';
import { validateCollection } from './utils/validate-collection';
import { ClickOutsideDirective } from '@shared/directives';
import { LocaleSensitiveDirective } from '@shared/localization';

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'groups',
  imports: [CommonModule, NgVirtualListComponent, GroupsLoadingIndicatorComponent, ClickOutsideDirective, LocaleSensitiveDirective],
  providers: [
    { provide: GroupsService, useClass: environment.useMock ? GroupsMockService : GroupsWebsocketService },
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  protected _list = viewChild('list', { read: NgVirtualListComponent });

  projectId = input<string>('');

  select = output<IVirtualListItem>();

  close = output<void>();

  collection = signal<IVirtualListCollection<any>>([]);

  isLoading = signal<boolean>(true);

  selectedId = signal<Id | undefined>(undefined);

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
}
