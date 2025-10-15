import { Component, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, delay, filter, map, mergeMap, of, skipWhile, Subject, switchMap, take, tap, throwError,
} from 'rxjs';
import { NgVirtualListComponent } from '@shared/components';
import {
  FocusAlignments, Id, IDisplayObjectConfig, ISize, IVirtualListCollection, IVirtualListItem, IVirtualListItemConfigMap,
} from '@shared/components/ng-virtual-list';
import { IRenderVirtualListItemConfig } from '@shared/components/ng-virtual-list/lib/models/render-item-config.model';
import { MessagesLoadingIndicatorComponent } from '@entities/messages';
import { MessageGroupComponent, MessagesTypingIndicatorComponent } from '@entities/message';
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
import { mergeItems } from './utils/merge-items';
import { generateTypingIndicator } from './utils/generate-typing-indicator';

const ROOT_VAR_DELETED_ITEM_HEIGHT = '--deleted-item-height',
  OPACITY_0 = '0', OPACITY_1 = '1', FADE_IN = `opacity 100ms ease-in`;

@Component({
  selector: 'messages',
  imports: [
    CommonModule, MessageBoxComponent, MessageGroupComponent, NgVirtualListComponent, MessagesTypingIndicatorComponent,
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

  isPreparedToShowing = signal<boolean>(false);

  private _$delete = new Subject<[IVirtualListItem<IItemData>, IRenderVirtualListItemConfig, ISize, number]>();
  protected $delete = this._$delete.asObservable();

  private _$edit = new Subject<{
    nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean,
  }>();
  protected $edit = this._$edit.asObservable();

  private _$change = new Subject<{ item: IVirtualListItem<IItemData>, config: IDisplayObjectConfig, value: string }>();
  protected $change = this._$change.asObservable();

  private _$scrollReachStart = new Subject<void>();
  protected $scrollReachStart = this._$scrollReachStart.asObservable();

  private _messagesService = inject(MessagesService);

  private _messageNotificationService = inject(MessagesNotificationService);

  private _messageService = inject(MessageService);

  private _destroyRef = inject(DestroyRef);

  listClasses = signal<{ [className: string]: boolean }>({});

  private _chunkNumber = 1;

  constructor() {
    const $collection = toObservable(this.collection),
      $search = toObservable(this.search),
      $edit = this.$edit,
      $delete = this.$delete,
      $change = this.$change,
      $scrollReachStart = this.$scrollReachStart,
      $chatId = this._messageService.$chatId,
      $virtualList = toObservable(this.list).pipe(
        takeUntilDestroyed(),
        filter(list => !!list),
      ),
      $isLoading = toObservable(this.isLoading);

    $virtualList.pipe(
      takeUntilDestroyed(),
      tap(list => {
        this._messageService.virtualList = list;
      }),
    ).subscribe();

    combineLatest([$virtualList, $chatId]).pipe(
      takeUntilDestroyed(),
      map(([list]) => list),
      filter(list => !!list),
      tap(list => {
        // reset
        this._chunkNumber = 1;
        this.list()?.cacheClean();
        this.collection.set([]);
        this.selectedIds.set([]);
        this.isPreparedToShowing.set(false);
        this.isLoading.set(true);
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_0;
        host.style.transition = FADE_IN;
      }),
      switchMap(list => $isLoading.pipe(
        filter(v => !v),
        switchMap(() => of(list)),
      )),
      switchMap(list => {
        return list.$update.pipe(
          debounceTime(250),
          switchMap(() => of(list)),
        );
      }),
      tap(list => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_1;
        this.isPreparedToShowing.set(true);
      }),
    ).subscribe();

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
            return this._messagesService.getMessages(chatId!, {
              number: this._chunkNumber,
              size: 100,
            });
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          tap(items => {
            this._chunkNumber++;
            const time = 2000 - (Date.now() - timeStart);
            delayTime = time < 0 ? 0 : time;
            validateCollection(items);

            const newItems = mergeItems(this.collection(), items),
              configMap = {};
            fillConfigMap(configMap, newItems);

            this.collectionConfigMap.set(configMap);
            this.collection.set(newItems);
          }),
          delay(delayTime),
          tap(() => {
            this.isLoading.set(false);
          }),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of(undefined);
          }),
        )
      })
    ).subscribe();

    $scrollReachStart.pipe(
      takeUntilDestroyed(),
      debounceTime(250),
      skipWhile(() => this._chunkNumber === 0),
      switchMap(() => $chatId.pipe(
        take(1),
      )),
      filter(v => v !== undefined),
      switchMap((chatId) => {
        return this._messagesService.getMessages(chatId, {
          number: this._chunkNumber + 1,
          size: 100,
        });
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get message chunk error: ${err}`;
        });
      }),
      tap(items => {
        this._chunkNumber += 1;
        validateCollection(items);

        const newItems = mergeItems(this.collection(), items),
          configMap = {};
        fillConfigMap(configMap, newItems);

        this.collectionConfigMap.set(configMap);
        this.collection.set(newItems);

        this.list()?.normalizePositions();
      }),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
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

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        return this._messageNotificationService.$writing.pipe(
          debounceTime(10),
          takeUntilDestroyed(this._destroyRef),
          mergeMap(userId => {
            return this.deleteWritingIndicator().pipe(
              tap(() => {
                const indicator = generateTypingIndicator(),
                  newItems = [...this.collection(), indicator.item],
                  configMap = { ...this.collectionConfigMap() };
                configMap[indicator.item.id] = indicator.config;
                this.collectionConfigMap.set(configMap);
                this.collection.set(newItems);
              }),
              switchMap(() => {
                return this._messageNotificationService.$messages.pipe(
                  takeUntilDestroyed(this._destroyRef),
                );
              }),
              mergeMap(() => {
                return this.deleteWritingIndicator();
              }),
            );
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
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
              document.documentElement.style.setProperty(ROOT_VAR_DELETED_ITEM_HEIGHT, `${measures.height - 28}px`);
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

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        return $edit.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(({ item, selected }) => {
            this._messageService.stopSnappingScrollToEnd();

            const collection = this.collection(),
              index = collection.findIndex(({ id }) => id === item.id);
            if (index > -1) {
              const items = [...collection], item = items[index];
              items[index] = { ...item, edited: selected === true, };
              this.collection.set(items);
            }
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        return $change.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this._messageService.stopSnappingScrollToEnd();
          }),
          switchMap(({ item, config, value }) => {
            const collection = this.collection(),
              index = collection.findIndex(({ id }) => id === item.id);
            if (index > -1) {
              const items = [...collection];
              items[index] = { ...item, processing: true, };
              this.collection.set(items);
            }

            const id = item.id;
            return this._messagesService.updateMessage(chatId, id, {
              name: value,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              filter(v => !!v),
              tap(updatedItem => {
                const collection = this.collection(),
                  index = collection.findIndex(({ id }) => id === updatedItem.id);
                if (index > -1) {
                  const items = [...collection], item = items[index];
                  items[index] = { ...item, ...updatedItem, processing: false, edited: false, };
                  this.collection.set(items);
                }
                config.select(false);
              }),
              catchError((err) => {
                const collection = this.collection(),
                  index = collection.findIndex(({ id }) => id === item.id);
                if (index > -1) {
                  const items = [...collection];
                  items[index] = { ...item, processing: false, };
                  this.collection.set(items);
                }
                console.error(`Delete message error: ${err}`);
                return of(undefined);
              }),
            );
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

  private deleteWritingIndicator() {
    return of(this.collection()).pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        let newItems = [...this.collection()], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let exists = true, i = 1;
          while (exists) {
            if (!newItems.length) {
              break;
            }
            const index = newItems.length - i, item = newItems[index];
            if (item?.['type'] === 'typing-indicator') {
              newItems[index] = { ...item, animate: true };
            } else {
              break;
            }
            i++;
          }
        }
        this.collectionConfigMap.set(config);
        this.collection.set(newItems);
      }),
      delay(1),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        let newItems = [...this.collection()], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let exists = true, i = 1;
          while (exists) {
            if (!newItems.length) {
              break;
            }
            const index = newItems.length - i, item = newItems[index];
            if (item?.['type'] === 'typing-indicator') {
              newItems[index] = { ...item, deleted: true };
            } else {
              break;
            }
            i++;
          }
        }
        this.collectionConfigMap.set(config);
        this.collection.set(newItems);
      }),
      delay(100),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        let newItems = [...this.collection()], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let exists = true;
          while (exists) {
            if (!newItems.length) {
              break;
            }
            const index = newItems.length - 1, item = newItems[index];
            if (item?.['type'] === 'typing-indicator') {
              newItems.pop();
              delete config[item.id];
            } else {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
        this.collection.set(newItems);
      }),
    );
  }

  onEditItemHandler(e:
    {
      nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean,
    }) {
    if (e.selected) {
      e.nativeEvent.stopImmediatePropagation();
    }
    this._$edit.next(e);
  }

  onChangeItemHandler({ item, config, value }:
    {
      nativeEvent: any, config: IDisplayObjectConfig, item: IVirtualListItem<IItemData>, value: string,
    }) {
    this._$change.next({ item, config, value });
  }

  onChangeMessageHandler(e: any) {
    this._messageService.stopSnappingScrollToEnd();
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
    this._$scrollReachStart.next(undefined);
  }

  onSelectItemHandler(ids: Array<Id> | Id | undefined) {
    this.selectedIds.set(Array.isArray(ids) ? ids : []);
  }

  onEditingCancelHandler(item: IVirtualListItem<IItemData>) {
    const collection = this.collection(),
      index = collection.findIndex(({ id }) => id === item.id);
    if (index > -1) {
      const items = [...collection], item = items[index];
      items[index] = { ...item, edited: false, };
      this.collection.set(items);
    }
  }
}
