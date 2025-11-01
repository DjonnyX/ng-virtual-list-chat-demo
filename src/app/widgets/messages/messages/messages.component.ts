import { Component, DestroyRef, effect, ElementRef, inject, input, OnDestroy, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, delay, filter, map, of, skipWhile, Subject, switchMap, take, tap, throwError,
} from 'rxjs';
import { environment } from '@environments/environment';
import { MessagesLoadingIndicatorComponent } from '@entities/messages';
import { MessageGroupComponent, MessagesTypingIndicatorComponent } from '@entities/message';
import { IDeleteEventData, MessageBoxComponent } from '@features/message';
import { XVirtualListComponent } from '@shared/components';
import {
  FocusAlignments, Id, IDisplayObjectConfig, ISize, IVirtualListItem, IVirtualListItemConfigMap,
} from '@shared/components/x-virtual-list';
import { IRenderVirtualListItemConfig } from '@shared/components/x-virtual-list/lib/models/render-item-config.model';
import { IMessageItemData } from "@shared/models/message";
import { MessageTypes } from '@shared/enums';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { MessagesService } from '../messages.service';
import { MessagesMockService } from '../messages-mock.service';
import { MessagesHttpService } from '../messages-http.service';
import { fillConfigMap } from './utils/fill-config-map';
import { validateCollection } from './utils/validate-collection';
import { MessageService } from '../message.service';
import { MessagesNotificationService } from '../messages-notification.service';
import { MessagesNotificationMockService } from '../messages-notification-mock.service';
import { MessagesNotificationWSService } from '../messages-notification-ws.service';
import { generateTypingIndicator } from './utils/generate-typing-indicator';
import { IProxyCollectionItem, ProxyCollection, ProxyCollectionEvents } from './utils/proxy-collection';
import { StaticClickDirective } from '@shared/directives';
import { createGroups } from './utils/create-groups';
import { LocalizationService } from '@shared/localization';

const ROOT_VAR_DELETED_ITEM_HEIGHT = '--deleted-item-height',
  OPACITY_0 = '0', OPACITY_1 = '1', FADE_IN = `opacity 100ms ease-in`, MIN_ITEM_HEIGHT = 28;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Component({
  selector: 'x-messages',
  imports: [
    CommonModule, MessageBoxComponent, MessageGroupComponent, XVirtualListComponent, MessagesTypingIndicatorComponent,
    MessagesLoadingIndicatorComponent, StaticClickDirective,
  ],
  providers: [
    { provide: MessagesService, useClass: environment.useMock ? MessagesMockService : MessagesHttpService },
    { provide: MessagesNotificationService, useClass: environment.useMock ? MessagesNotificationMockService : MessagesNotificationWSService },
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnDestroy {
  protected _wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  protected _list = viewChild('list', { read: XVirtualListComponent });

  search = input<string>();

  searchedPattern = signal<Array<string>>([]);

  collection = signal<Array<IProxyCollectionItem<IMessageItemData>>>([]);
  protected $collection = toObservable(this.collection);

  theme: Signal<ITheme | undefined>;

  protected _proxyCollection = new ProxyCollection<IMessageItemData>([]);

  collectionConfigMap = signal<IVirtualListItemConfigMap>({});

  selectedIds = signal<Array<Id> | Id | undefined>([]);

  isLoading = signal<boolean>(true);

  isPreparedToShowing = signal<boolean>(false);

  private _$delete = new Subject<[IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, IRenderVirtualListItemConfig, ISize, boolean]>();
  protected $delete = this._$delete.asObservable();

  private _$edit = new Subject<{
    nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean,
  }>();
  protected $edit = this._$edit.asObservable();

  private _$change = new Subject<{ item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, value: string | undefined }>();
  protected $change = this._$change.asObservable();

  private _$scrollReachStart = new Subject<void>();
  protected $scrollReachStart = this._$scrollReachStart.asObservable();

  private _messagesService = inject(MessagesService);

  private _messageNotificationService = inject(MessagesNotificationService);

  private _messageService = inject(MessageService);

  private _destroyRef = inject(DestroyRef);

  listClasses = signal<{ [className: string]: boolean }>({});

  private _chunkNumber = 1;

  private _$proxyCollectionChange = new Subject<void>();
  protected $proxyCollectionChange = this._$proxyCollectionChange.asObservable();

  private _proxyCollectionChangeHandler = () => {
    this._$proxyCollectionChange.next();
  };

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _localizationService = inject(LocalizationService);

  readonly maxStaticClickDistance = 40;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), host = this._elementRef.nativeElement as HTMLDivElement;
      if (theme && host) {
        const preset = this._themeService.getPreset(theme.chat.messages);
        if (preset) {
          host.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), wrapper = this._wrapper()?.nativeElement;
      if (theme && wrapper) {
        const preset = this._themeService.getPreset(theme.chat.messages);
        if (preset) {
          wrapper.style.backgroundImage = preset.backgroundImage;
        }
      }
    });

    this._proxyCollection.addEventListener(ProxyCollectionEvents.CHANGE, this._proxyCollectionChangeHandler);
    const $collection = toObservable(this.collection),
      $search = toObservable(this.search),
      $edit = this.$edit,
      $delete = this.$delete,
      $change = this.$change,
      $scrollReachStart = this.$scrollReachStart,
      $chatId = this._messageService.$chatId,
      $proxyCollectionChange = this.$proxyCollectionChange,
      $virtualList = toObservable(this._list).pipe(
        takeUntilDestroyed(),
        filter(list => !!list),
      ),
      $isLoading = toObservable(this.isLoading);

    $proxyCollectionChange.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.collection.set(this._proxyCollection.toObject());
      }),
    ).subscribe();

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
        this._list()?.cacheClean();
        this._proxyCollection.from([]);
        this.selectedIds.set([]);
        this.isPreparedToShowing.set(false);
        this.isLoading.set(true);
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_0;
        host.style.transition = FADE_IN;
      }),
      switchMap(list => $isLoading.pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(v => !v),
        switchMap(() => of(list)),
      )),
      takeUntilDestroyed(this._destroyRef),
      switchMap(list => {
        return list.$update.pipe(
          takeUntilDestroyed(this._destroyRef),
          debounceTime(500),
          switchMap(() => of(list)),
        );
      }),
      takeUntilDestroyed(this._destroyRef),
      tap(list => {
        const host = list.host.nativeElement as HTMLElement;
        host.style.opacity = OPACITY_1;
        this.isPreparedToShowing.set(true);
      }),
    ).subscribe();

    combineLatest([$chatId, this._localizationService.$locale, this._localizationService.$localization]).pipe(
      takeUntilDestroyed(),
      debounceTime(0),
      map(([chatId, locale, localization]) => ({ chatId, locale, localization })),
      switchMap(({ chatId, locale, localization }) => {
        const timeStart = Date.now();
        let delayTime = 100;
        return of(chatId).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(true);
          }),
          switchMap(chatId => {
            return this._messagesService.getMessages(chatId!, {
              number: this._chunkNumber,
              size: 100,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, locale, localization))),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          takeUntilDestroyed(this._destroyRef),
          switchMap(res => {
            const items = Array.isArray(res.items) ? res.items : [];
            this._chunkNumber++;
            const time = 2000 - (Date.now() - timeStart);
            delayTime = time < 0 ? 0 : time;
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);

            return of(items);
          }),
          delay(delayTime),
          takeUntilDestroyed(this._destroyRef),
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

    combineLatest([$scrollReachStart, this._localizationService.$locale, this._localizationService.$localization]).pipe(
      takeUntilDestroyed(),
      debounceTime(250),
      skipWhile(() => this._chunkNumber === 0),
      map(([scrollReachStart, locale, localization]) => ({ scrollReachStart, locale, localization })),
      switchMap(({ locale, localization }) => $chatId.pipe(
        takeUntilDestroyed(this._destroyRef),
        take(1),
        filter(v => v !== undefined),
        switchMap((chatId) => {
          return this._messagesService.getMessages(chatId, {
            number: this._chunkNumber + 1,
            size: 100,
          }).pipe(
            takeUntilDestroyed(this._destroyRef),
            switchMap(v => of(createGroups(v, locale, localization))),
          );
        }),
      )),

      catchError((err) => {
        return throwError(() => {
          return `Get message chunk error: ${err}`;
        });
      }),
      tap(res => {
        const items = Array.isArray(res.items) ? res.items : [];
        this._chunkNumber += 1;
        validateCollection(items);

        this._proxyCollection.from(items, true);
        const configMap = {};
        fillConfigMap(configMap, this._proxyCollection.collection);
        this.collectionConfigMap.set(configMap);

        this._list()?.normalizePositions();
      }),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
    ).subscribe();

    combineLatest([$chatId, this._localizationService.$locale, this._localizationService.$localization]).pipe(
      takeUntilDestroyed(),
      map(([chatId, locale, localization]) => ({ chatId: chatId as string, locale, localization })),
      filter(({ chatId }) => chatId !== undefined),
      switchMap(({ chatId, locale, localization }) => {
        return this._messageNotificationService.$messages.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(version => {
            return this._messagesService.getMessages(chatId).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, locale, localization))),
            );
          }),
        );
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get message chunk error: ${err}`;
        });
      }),
      tap(res => {
        const items = Array.isArray(res.items) ? res.items : [];
        validateCollection(items);
        this._proxyCollection.from(items, true);
        const configMap = {};
        fillConfigMap(configMap, this._proxyCollection.collection);
        this.collectionConfigMap.set(configMap);
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
          takeUntilDestroyed(this._destroyRef),
          debounceTime(10),
          switchMap(userId => {
            return this.deleteWritingIndicator(chatId).pipe(
              takeUntilDestroyed(this._destroyRef),
              tap(() => {
                const indicator = generateTypingIndicator();
                this._proxyCollection.set(indicator.item.id, indicator.item);
                const configMap = { ...this.collectionConfigMap() };
                configMap[indicator.item.id] = indicator.config;
                this.collectionConfigMap.set(configMap);
              }),
              switchMap(() => {
                return this._messageNotificationService.$messages.pipe(
                  takeUntilDestroyed(this._destroyRef),
                );
              }),
              switchMap(() => {
                return this.deleteWritingIndicator(chatId).pipe(
                  takeUntilDestroyed(this._destroyRef),
                );
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
          switchMap(([item, config, measures, deleteAll]) => {
            this._proxyCollection.setParams(item.id, { removal: true, });
            const id = item.id;
            return this._messagesService.deleteMessage(chatId, id, { deleteAll }).pipe(
              takeUntilDestroyed(this._destroyRef),
              catchError((err) => {
                this._proxyCollection.setParams(item.id, { removal: false, });
                console.error(`Delete message error: ${err}`);
                return of();
              }),
              switchMap(version => {
                this._proxyCollection.setParams(item.id, { version, });
                return of({ item, config, measures }).pipe(
                  takeUntilDestroyed(this._destroyRef),
                );
              }),
            );
          }),
          tap(({ item, measures }) => {
            if (this._proxyCollection.has(item.id)) {
              document.documentElement.style.setProperty(ROOT_VAR_DELETED_ITEM_HEIGHT, `${measures.height - MIN_ITEM_HEIGHT}px`);
              this._proxyCollection.setParams(item.id, { animate: true, deleting: false, });
            }
          }),
          delay(0),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item }) => {
            this._proxyCollection.setParams(item.id, { deleted: true, });
          }),
          delay(150),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item }) => {
            this._proxyCollection.delete(item.id);
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

            this._proxyCollection.setParams(item.id, { edited: selected === true, });
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
            this._proxyCollection.setParams(item.id, { processing: true, });
            const id = item.id;
            return this._messagesService.updateMessage(chatId, id, {
              text: value,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              filter(v => !!v),
              tap(updatedItem => {
                this._proxyCollection.set(item.id, updatedItem, { processing: false, edited: false, });
                config.select(false);
              }),
              catchError((err) => {
                this._proxyCollection.setParams(item.id, { processing: false, });
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
          const item = collection[i], name: string = item.data?.text;
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
      takeUntilDestroyed(this._destroyRef),
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

  private deleteWritingIndicator(chatId: Id) {
    return of(chatId).pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.setParams(item.id, { animate: true, });
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
      delay(1),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.setParams(item.id, { deleted: true, });
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
      delay(100),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.delete(item.id);
              newItems.pop();
              delete config[item.id];
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
    );
  }

  onEditItemHandler(e:
    {
      nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean,
    }) {
    this._$edit.next(e);
  }

  onChangeItemHandler({ item, config, value }:
    {
      nativeEvent: any, config: IDisplayObjectConfig, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, value: string | undefined,
    }) {
    this._$change.next({ item, config, value });
  }

  onChangeMessageHandler(e: any) {
    this._messageService.stopSnappingScrollToEnd();
  }

  onDeleteItemHandler({ data, componentData }:
    {
      data: IDeleteEventData | undefined;
      componentData: boolean;
    }, index: number) {
    if (data && data.item) {
      this._$delete.next([data.item, data.config, data.measures, componentData]);
    }
  }

  onScrollReachStartHandler() {
    this._$scrollReachStart.next(undefined);
  }

  onSelectItemHandler(ids: Array<Id> | Id | undefined) {
    this.selectedIds.set(Array.isArray(ids) ? ids : []);
  }

  onEditingCancelHandler(item: IVirtualListItem<IMessageItemData>) {
    this._proxyCollection.setParams(item.id, { edited: false, });
  }

  ngOnDestroy(): void {
    if (this._proxyCollection) {
      this._proxyCollection.dispose();
    }
  }
}
