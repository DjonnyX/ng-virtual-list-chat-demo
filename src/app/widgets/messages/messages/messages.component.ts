import { Component, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, delay, filter, map, mergeMap, of, Subject, switchMap, take, tap, throwError,
} from 'rxjs';
import { NgVirtualListComponent } from '@shared/components';
import {
  FocusAlignments, Id, IRenderVirtualListItem, ISize, IVirtualListCollection, IVirtualListItem, IVirtualListItemConfigMap,
} from '@shared/components/ng-virtual-list';
import { IRenderVirtualListItemConfig } from '@shared/components/ng-virtual-list/lib/models/render-item-config.model';
import { MessagesLoadingIndicatorComponent } from '@entities/messages';
import { MessageGroupComponent, MessagesWritingIndicatorComponent } from '@entities/message';
import { MessageBoxComponent } from '@features/message';
import { environment } from '@environments/environment';
import { IItemData } from '@mock/const/collection';
import { MessagesService } from '../messages.service';
import { MessagesMockService } from '../messages-mock.service';
import { MessagesHttpService } from '../messages-http.service';
import { fillConfigMap } from './utils/fill-config-map';
import { appendItems } from './utils/append-items';
import { validateCollection } from './utils/validate-collection';
import { MessageService } from '../message.service';
import { MessagesNotificationService } from '../messages-notification.service';
import { MessagesNotificationMockService } from '../messages-notification-mock.service';
import { MessagesNotificationWSService } from '../messages-notification-ws.service';
import { BEHAVIOR_INSTANT } from '@shared/components/ng-virtual-list/lib/const';
import { mergeItems } from './utils/merge-items';

const OPACITY_0 = '0', OPACITY_1 = '1', TRANSITION_NONE = 'none', FADE_IN = `opacity 100ms ease-in`;

@Component({
  selector: 'messages',
  imports: [
    CommonModule, MessageBoxComponent, MessageGroupComponent, NgVirtualListComponent, MessagesWritingIndicatorComponent,
    MessagesLoadingIndicatorComponent,
  ],
  providers: [
    { provide: MessagesService, useClass: environment.useMock ? MessagesMockService : MessagesHttpService },
    { provide: MessagesNotificationService, useClass: environment.useMock ? MessagesNotificationMockService : MessagesNotificationWSService },
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  protected list = viewChild('list', { read: NgVirtualListComponent });

  search = input<string>();

  searchedPattern = signal<Array<string>>([]);

  collection = signal<IVirtualListCollection<IItemData>>([]);

  collectionConfigMap = signal<IVirtualListItemConfigMap>({});

  selectedIds = signal<Array<Id> | Id | undefined>([]);

  isLoading = signal<boolean>(true);

  private _$delete = new Subject<[IVirtualListItem<IItemData>, IRenderVirtualListItemConfig, ISize, number]>();
  protected $delete = this._$delete.asObservable();

  private _messagesService = inject(MessagesService);

  private _messageNotificationService = inject(MessagesNotificationService);

  private _messageService = inject(MessageService);

  private _destroyRef = inject(DestroyRef);

  private _$reset = new Subject<boolean>();
  protected $reset = this._$reset.asObservable();

  listClasses = signal<{ [className: string]: boolean }>({});

  constructor() {
    const $reset = this.$reset,
      $collection = toObservable(this.collection),
      $search = toObservable(this.search),
      $delete = this.$delete;

    let isReseted = true;

    const $virtualList = toObservable(this.list).pipe(
      takeUntilDestroyed(),
      filter(list => !!list),
    );

    $virtualList.pipe(
      takeUntilDestroyed(),
      tap(list => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_0;
        host.style.transition = FADE_IN;
      }),
      delay(100),
      switchMap(list => {
        return list.$update.pipe(
          debounceTime(250),
          take(1),
          switchMap(() => of(list)),
        );
      }),
      tap(list => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_1;
      }),
      tap(() => {
        isReseted = false;
        this.isLoading.set(false);
      })
    ).subscribe();

    combineLatest([$virtualList, $reset]).pipe(
      takeUntilDestroyed(),
      map(([list, reset]) => ({ list, reset })),
      filter(({ reset }) => !!reset),
      tap(({ list }) => {
        isReseted = true;
        const host = list.host.nativeElement as HTMLElement;
        host.style.transition = TRANSITION_NONE;
        host.style.opacity = OPACITY_0;
      }),
      delay(1),
      tap(({ list }) => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.transition = FADE_IN;
      }),
      switchMap(({ list }) => {
        return list.$update.pipe(
          debounceTime(250),
          take(1),
          switchMap(() => of(list)),
        );
      }),
      tap(list => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_1;
      }),
      tap(() => {
        isReseted = false;
        this.isLoading.set(false);
      })
    ).subscribe();

    $virtualList.pipe(
      takeUntilDestroyed(),
      debounceTime(100),
      tap(list => {
        list!.scrollToEnd(undefined, {
          behavior: BEHAVIOR_INSTANT,
          iteration: 4,
        });
      }),
    ).subscribe();

    const $chatId = this._messageService.$chatId;

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        const timeStart = Date.now();
        let delayTime = 100;
        return of(chatId).pipe(
          tap(() => {
            this.isLoading.set(true);
          }),
          switchMap(chatId => {
            return this._messagesService.getMessages(chatId!);
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          tap(items => {
            const time = 2000 - (Date.now() - timeStart);
            delayTime = time < 0 ? 0 : time;
            validateCollection(items);

            const newItems = mergeItems(this.collection(), items),
              configMap = {};
            fillConfigMap(configMap, newItems);

            this.collectionConfigMap.set(configMap);
            this.collection.set(newItems);
          }),
          delay(50),
          tap(items => {
            const list = this.list();
            list?.scrollToEnd(undefined);
          }),
          delay(delayTime),
          tap(() => {
            if (!isReseted) {
              this.isLoading.set(false);
            }
          }),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of(undefined);
          }),
        )
      })
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        return this._messageNotificationService.$messages.pipe(
          switchMap(version => {
            return this._messagesService.getMessages(chatId);
          }),
        );
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get message chunk error: ${err}`;
        });
      }),
      tap(items => {
        validateCollection(items);

        const newItems = mergeItems(this.collection(), items),
          configMap = {};
        fillConfigMap(configMap, newItems);

        this.collectionConfigMap.set(configMap);
        this.collection.set(newItems);
      }),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
    ).subscribe();

    let previousChatId: Id | undefined = undefined;

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        if (previousChatId !== undefined) {
          this.resetList();
        }
        previousChatId = chatId;
        return $delete.pipe(
          takeUntilDestroyed(this._destroyRef),
          mergeMap(([item, config, measures, index]) => {
            const collection = this.collection();
            if (index > -1) {
              const items = [...collection], item = items[index];
              items[index] = { ...item, removal: true };
              this.collection.set(items);
            }

            const id = item.id;
            return this._messagesService.deleteMessage(chatId, id).pipe(
              catchError((err) => {
                const collection = this.collection(), index = collection.findIndex(({ id }) => id === item.id);
                if (index > -1) {
                  const items = [...collection], item = items[index];
                  items[index] = { ...item, removal: false };
                  this.collection.set(items);
                }
                console.error(`Delete message error: ${err}`);
                return of();
              }),
              switchMap(() => {
                return of({ item, config, measures });
              }),
            );
          }),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item, measures }) => {
            const collection = this.collection(), index = collection.findIndex(({ id }) => id === item.id);
            if (index > -1) {
              document.documentElement.style.setProperty('--deleted-item-height', `${measures.height - 28}px`);
              const items = [...collection], item = items[index];
              items[index] = { ...item, animate: true, deleting: false };
              this.collection.set(items);
            }
          }),
          delay(0),
          tap(({ item }) => {
            const collection = this.collection(), index = collection.findIndex(({ id }) => id === item.id);
            if (index > -1) {
              const items = [...collection], item = items[index];
              items[index] = { ...item, deleted: true };
              this.collection.set(items);
            }
          }),
          delay(150),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item }) => {
            const collection = this.collection(), index = collection.findIndex(({ id }) => id === item.id);
            if (index > -1) {
              const items = [...collection];
              items.splice(index, 1);
              this.collection.set(items);
            }
          }),
          catchError((e) => {
            console.error(e)
            return of();
          }),
        );
      }),
    ).subscribe();

    combineLatest([$virtualList, $collection, $search]).pipe(
      takeUntilDestroyed(),
      map(([list, collection, search]) => ({ list, collection, search: search ?? '' })),
      filter(({ list }) => !!list),
      debounceTime(250),
      tap(({ search }) => {
        this.searchedPattern.set(search.split(' '));
      }),
      filter(({ search }) => search !== ''),
      switchMap(({ list, collection, search }) => {
        for (let i = 0, l = collection.length; i < l; i++) {
          const item = collection[i], name: string = item['name'];
          if (name) {
            const index = name?.indexOf(search);
            if (index > -1) {
              const id = item.id;
              return of(({ id, list }));
            }
          }
        }
        return of({ id: undefined, list: undefined });
      }),
      tap(({ id, list }) => {
        if (id !== undefined && list) {
          list!.scrollTo(id);
        }
      }),
      debounceTime(2000),
      tap(({ id, list }) => {
        if (id !== undefined && list) {
          list.focus(id, FocusAlignments.NONE);
        }
      }),
    ).subscribe();
  }

  resetList() {
    this._$reset.next(true);
    this.selectedIds.set([]);
  }

  onEditItemHandler({ nativeEvent, item, selected }:
    {
      nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean,
    }) {
    if (selected) {
      nativeEvent.stopImmediatePropagation();
    }
    // const index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
    // if (index > -1) {
    //   const items = [...this.groupDynamicItems], item = items[index];
    //   items[index] = { ...item, edited: selected ? !item.edited : false };
    //   this.groupDynamicItems = items;
    //   this.increaseVersion();
    // }
  }

  onTextEditedHandler({ nativeEvent, item }:
    {
      nativeEvent: any, item: IVirtualListItem<IItemData>,
    }) {
    // const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
    // if (index > -1) {
    //   const items = [...this.groupDynamicItems], _item = items[index];
    //   items[index] = { ..._item, edited: !_item.edited, name: nativeEvent.target?.value };
    //   this.groupDynamicItems = items;
    //   this.increaseVersion();
    // }
  }

  onDeleteItemHandler({ nativeEvent, item, config, measures }:
    {
      nativeEvent: Event, item: IVirtualListItem<IItemData>, config: IRenderVirtualListItemConfig, measures: ISize,
    }, index: number) {
    if (item) {
      nativeEvent.stopImmediatePropagation();
      this._$delete.next([item, config, measures, index]);
    }
  }

  onScrollReachStartHandler() {
    // const trackBy = this.trackBy;
    // let items = [...this.groupDynamicItems], firstGroup = items.splice(0, 1), messages = [];
    // for (let i = 0, l = 100; i < l; i++) {
    //   const msgStart = generateMessage(this._nextIndex);
    //   this._nextIndex++;
    //   this.groupDynamicItemsConfigMap[msgStart[trackBy]] = {
    //     sticky: 0,
    //     selectable: true,
    //   };
    //   messages.unshift(msgStart);
    // }

    // items = [...firstGroup, ...messages, ...items];

    // this.groupDynamicItems = items;

    // this.increaseVersion();
  }

  onClickHandler(item: IRenderVirtualListItem | undefined) {
    // if (item) {
    //   const trackBy = this.trackBy;
    //   console.info(`Click: (ID: ${item.data?.[trackBy]}) Item ${item.data.name}`);
    // }
  }

  onSelectItemHandler(ids: Array<Id> | Id | undefined) {
    this.selectedIds.set(Array.isArray(ids) ? ids : []);
  }
}
