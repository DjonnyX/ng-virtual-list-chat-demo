import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Signal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgVirtualListComponent, IRenderVirtualListItem, Id, FocusAlignments, IScrollEvent, ISize } from './components/ng-virtual-list/public-api';
import {
  BehaviorSubject, combineLatest, debounceTime, delay, filter, from, interval, map, mergeMap, of, Subject, switchMap, tap,
} from 'rxjs';
import { LOGO } from './const';
import { GROUP_DYNAMIC_ITEMS, GROUP_DYNAMIC_ITEMS_STICKY_MAP, IItemData, ITEMS } from './const/collection';
import { generateMessage, generateWriteIndicator } from './utils/collection';
import { FormsModule } from '@angular/forms';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { SearchComponent } from './components/search/search.component';
import { DrawerComponent, DockMode } from "./components/drawer/drawer.component";
import { LongPressDirective } from './directives';
import { ClickOutsideService } from './directives/click-outside.service';
import { IRenderVirtualListItemConfig } from './components/ng-virtual-list/lib/models/render-item-config.model';
import { MessageComponent } from './components/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NgVirtualListComponent, MenuButtonComponent,
    SearchComponent, DrawerComponent, LongPressDirective, MessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent {
  readonly trackBy = 'id';

  readonly logo = LOGO;

  protected _listContainerRef = viewChild('dynamicList', { read: NgVirtualListComponent });

  protected _stats = viewChild('stats', { read: ElementRef<HTMLDivElement> });

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  private _$delete = new Subject<[IItemData, IRenderVirtualListItemConfig, ISize]>();

  menuOpened = signal<boolean>(false);

  dockMode: Signal<DockMode.LEFT | DockMode.NONE>;

  show = signal(true);

  search = signal('');

  searchedWords = signal<Array<string>>([]);

  items = ITEMS;

  title = signal<string>('Demo');

  groupDynamicItems = [...GROUP_DYNAMIC_ITEMS];
  groupDynamicItemsConfigMap = { ...GROUP_DYNAMIC_ITEMS_STICKY_MAP };

  constructor(private _service: ClickOutsideService) {
    const list = this._listContainerRef,
      trackBy = this.trackBy;

    this.dockMode = computed(() => {
      const menuOpened = this.menuOpened();
      return menuOpened ? DockMode.LEFT : DockMode.NONE;
    });

    const $virtualList = toObservable(list).pipe(
      takeUntilDestroyed(),
      filter(list => !!list),
      switchMap(list => combineLatest([of(list), list?.$initialized])),
      filter(([, init]) => !!init),
      map(([list]) => list),
    );

    combineLatest([this.$version, $virtualList]).pipe(
      takeUntilDestroyed(),
      map(([version, list]) => ({ version, list })),
      filter(({ list }) => !!list),
      debounceTime(50),
      tap(({ version, list }) => {
        // init
        if (version < 2) {
          list!.scrollToEnd(undefined, {
            behavior: 'instant',
          });
        }
      }),
    ).subscribe();

    combineLatest([$virtualList, toObservable(this.search)]).pipe(
      takeUntilDestroyed(),
      map(([list, search]) => ({ list, search })),
      filter(({ list }) => !!list),
      debounceTime(250),
      tap(({ search }) => {
        this.searchedWords.set(search.split(' '));
      }),
      filter(({ search }) => search !== ''),
      switchMap(({ list, search }) => {
        for (let i = 0, l = this.groupDynamicItems.length; i < l; i++) {
          const item = this.groupDynamicItems[i], name: string = item['name'];
          if (name) {
            const index = name?.indexOf(search);
            if (index > -1) {
              const id = item[trackBy];
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

    $virtualList.pipe(
      takeUntilDestroyed(),
      delay(100),
      mergeMap(() => this.write()),
    ).subscribe();

    from(interval(2000)).pipe(
      takeUntilDestroyed(),
      mergeMap(() => this.write()),
    ).subscribe();

    const appHeightHandler = () => document.documentElement.style.setProperty('--app-height', `${document.documentElement.clientHeight}px`);
    window.addEventListener('resize', appHeightHandler);

    $virtualList.pipe(
      takeUntilDestroyed(),
      tap(() => {
        appHeightHandler();
      }),
      delay(100),
      tap(() => {
        document.documentElement.style.setProperty('--viewport-alpha', '1');
      }),
    ).subscribe();

    const $delete = this._$delete;
    $delete.pipe(
      takeUntilDestroyed(),
      mergeMap(([item, config, measures]) => {
        const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
        if (index > -1) {
          document.documentElement.style.setProperty('--deleted-item-height', `${measures.height - 28}px`);
          const items = [...this.groupDynamicItems], item = items[index];
          items[index] = { ...item, animate: true };
          this.groupDynamicItems = items;

          return of(item);
        }
        return of();
      }),
      filter(v => v !== undefined),
      delay(0),
      takeUntilDestroyed(),
      tap(item => {
        const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
        if (index > -1) {
          const items = [...this.groupDynamicItems], item = items[index];
          items[index] = { ...item, deleted: true };
          this.groupDynamicItems = items;
        }
      }),
      delay(150),
      takeUntilDestroyed(),
      tap(item => {
        const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
        if (index > -1) {
          const items = [...this.groupDynamicItems];
          items.splice(index, 1);
          this.groupDynamicItems = items;
        }
      }),
    ).subscribe();
  }

  onSearchHandler(pattern: string) {
    this.search.set(pattern);
  }

  onDockClose() {
    this.menuOpened.set(false);
  }

  private resetList() {
    this.groupDynamicItems = [...GROUP_DYNAMIC_ITEMS];
    this.groupDynamicItemsConfigMap = { ...GROUP_DYNAMIC_ITEMS_STICKY_MAP };
  }

  private _nextIndex = this.groupDynamicItems.length;

  private write() {
    const trackBy = this.trackBy, msg = generateMessage(this._nextIndex);
    this._nextIndex++;
    return of(msg).pipe(
      tap(() => {
        const writeIndicator = generateWriteIndicator(this._nextIndex);
        this._nextIndex++;
        this.groupDynamicItems = [...this.groupDynamicItems, writeIndicator];
        this.groupDynamicItemsConfigMap[writeIndicator[trackBy]] = {
          sticky: 0,
          selectable: false,
        };

        this.increaseVersion();
      }),
      delay(500),
      tap(() => {
        const items = [...this.groupDynamicItems];
        items.pop();
        items.push(msg);
        this.groupDynamicItemsConfigMap[msg[trackBy]] = {
          sticky: 0,
          selectable: true,
        };

        this.groupDynamicItems = items;
        this.increaseVersion();
      }),
    );
  }

  private increaseVersion() {
    const v = this._$version.getValue();
    this._$version.next(v === Number.MAX_SAFE_INTEGER ? 0 : v + 1);
  }

  onScrollReachStartHandler() {
    const trackBy = this.trackBy;
    let items = [...this.groupDynamicItems], firstGroup = items.splice(0, 1), messages = [];
    for (let i = 0, l = 100; i < l; i++) {
      const msgStart = generateMessage(this._nextIndex);
      this._nextIndex++;
      this.groupDynamicItemsConfigMap[msgStart[trackBy]] = {
        sticky: 0,
        selectable: true,
      };
      messages.unshift(msgStart);
    }

    items = [...firstGroup, ...messages, ...items];

    this.groupDynamicItems = items;

    this.increaseVersion();
  }

  onClickHandler(item: IRenderVirtualListItem | undefined) {
    if (item) {
      const trackBy = this.trackBy;
      console.info(`Click: (ID: ${item.data?.[trackBy]}) Item ${item.data.name}`);
    }
  }

  onEditItemHandler({ nativeEvent, item, selected }: { nativeEvent: Event, item: IItemData | undefined, selected: boolean }) {
    if (selected) {
      nativeEvent.stopImmediatePropagation();
    }
    const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
    if (index > -1) {
      const items = [...this.groupDynamicItems], item = items[index];
      items[index] = { ...item, edited: selected ? !item.edited : false };
      this.groupDynamicItems = items;
      this.increaseVersion();
    }
  }

  onOutsideClickHandler({ item }: { nativeEvent: Event, item: IItemData | undefined, selected: boolean }) {
    const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
    if (index > -1) {
      const items = [...this.groupDynamicItems], item = items[index];
      items[index] = { ...item, edited: false };
      this.groupDynamicItems = items;
      this.increaseVersion();
    }
    this._service.activeTarget = null;
  }

  onEditingCloseHandler(data: { target: any; item: IItemData & { id: Id }; }) {
    const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === data.item?.[trackBy]);
    if (index > -1) {
      const items = [...this.groupDynamicItems], _item = items[index];
      items[index] = { ..._item, edited: false, name: data.target.value };
      this.groupDynamicItems = items;
      this.increaseVersion();
    }
  }

  onTextEditedHandler({ nativeEvent, item }: { nativeEvent: any, item: IItemData | undefined }) {
    const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
    if (index > -1) {
      const items = [...this.groupDynamicItems], _item = items[index];
      items[index] = { ..._item, edited: !_item.edited, name: nativeEvent.target?.value };
      this.groupDynamicItems = items;
      this.increaseVersion();
    }
  }

  onDeleteItemHandler(e: Event, item: IItemData | undefined, config: IRenderVirtualListItemConfig, measures: ISize) {
    if (item) {
      e.stopImmediatePropagation();
      this._$delete.next([item, config, measures]);
    }
  }

  onRoomClickHandler(item: IRenderVirtualListItem | undefined) {
    this.menuOpened.set(false);
    if (item) {
      this.title.set(item.data['name']);
      this.resetList();
      this._listContainerRef()?.scrollToEnd(undefined, {
        behavior: 'instant',
        iteration: 4,
      });
    }
  }

  onOpenMenuHandler() {
    this.menuOpened.update(v => !v);
  }

  onRoomsClickOutside() {
    this.onDockClose();
  }

  onInfo(params: Array<any>) {
    const [param1, param2, param3] = params;
    this.title.set(`${param1}, ${param2}, ${param3}`)
  }
}
