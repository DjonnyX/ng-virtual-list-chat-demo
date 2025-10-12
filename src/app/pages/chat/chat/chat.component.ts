import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Signal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRenderVirtualListItem, IVirtualListItem } from '@shared/components/ng-virtual-list';
import {
  BehaviorSubject,
} from 'rxjs';
import { MenuButtonComponent, MessageSearchComponent } from '@entities/header';
import { DrawerComponent, DockMode } from "@shared/components";
import { ClickOutsideService } from '@shared/directives';
import { generateChatCollection } from '@mock/const';
import { MessagesComponent } from "@widgets/messages/messages/messages.component";
import { GroupsComponent } from "@widgets/groups/groups/groups.component";
import { MessageService } from '@widgets/messages';

@Component({
  selector: 'chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuButtonComponent, MessageSearchComponent, DrawerComponent, 
    MessagesComponent, GroupsComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService, MessageService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ChatComponent {
  protected _stats = viewChild('stats', { read: ElementRef<HTMLDivElement> });

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  menuOpened = signal<boolean>(false);

  dockMode: Signal<DockMode.LEFT | DockMode.NONE>;

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string>('Demo');

  private _messageService = inject(MessageService);

  constructor() {
    this.dockMode = computed(() => {
      const menuOpened = this.menuOpened();
      return menuOpened ? DockMode.LEFT : DockMode.NONE;
    });
  }

  onSearchHandler(pattern: string) {
    this.search.set(pattern);
  }

  onDockClose() {
    this.menuOpened.set(false);
  }

  // onScrollReachStartHandler() {
  //   const trackBy = this.trackBy;
  //   let items = [...this.groupDynamicItems], firstGroup = items.splice(0, 1), messages = [];
  //   for (let i = 0, l = 100; i < l; i++) {
  //     const msgStart = generateMessage(this._nextIndex);
  //     this._nextIndex++;
  //     this.groupDynamicItemsConfigMap[msgStart[trackBy]] = {
  //       sticky: 0,
  //       selectable: true,
  //     };
  //     messages.unshift(msgStart);
  //   }

  //   items = [...firstGroup, ...messages, ...items];

  //   this.groupDynamicItems = items;

  //   this.increaseVersion();
  // }

  onClickHandler(item: IRenderVirtualListItem | undefined) {
    if (item) {
      console.info(`Click: (ID: ${item.data.id}) Item ${item.data.name}`);
    }
  }

  // onEditItemHandler({ nativeEvent, item, selected }:
  //   {
  //     nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean,
  //   }) {
  //   if (selected) {
  //     nativeEvent.stopImmediatePropagation();
  //   }
  //   const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
  //   if (index > -1) {
  //     const items = [...this.groupDynamicItems], item = items[index];
  //     items[index] = { ...item, edited: selected ? !item.edited : false };
  //     this.groupDynamicItems = items;
  //     this.increaseVersion();
  //   }
  // }

  // onEditingCloseHandler(data: { target: any; item: IVirtualListItem<IItemData>; }) {
  //   const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === data.item?.[trackBy]);
  //   if (index > -1) {
  //     const items = [...this.groupDynamicItems], _item = items[index];
  //     items[index] = { ..._item, edited: false, name: data.target.value };
  //     this.groupDynamicItems = items;
  //     this.increaseVersion();
  //   }
  // }

  // onTextEditedHandler({ nativeEvent, item }:
  //   {
  //     nativeEvent: any, item: IVirtualListItem<IItemData>,
  //   }) {
  //   const trackBy = this.trackBy, index = this.groupDynamicItems.findIndex(it => it?.[trackBy] === item?.[trackBy]);
  //   if (index > -1) {
  //     const items = [...this.groupDynamicItems], _item = items[index];
  //     items[index] = { ..._item, edited: !_item.edited, name: nativeEvent.target?.value };
  //     this.groupDynamicItems = items;
  //     this.increaseVersion();
  //   }
  // }

  onGroupsCloseHandler() {
    this.menuOpened.set(false);
  }

  onGroupSelectHandler(item: IVirtualListItem) {
    this.menuOpened.set(false);
    this.title.set(item?.['name']);
    this._messageService.changeChat(`${item?.['id']}`);
  }

  onOpenMenuHandler() {
    this.menuOpened.update(v => !v);
  }

  // onRoomsClickOutside() {
  //   this.onDockClose();
  // }

  onInfo(params: Array<any>) {
    const [param1, param2, param3] = params;
    this.title.set(`${param1}, ${param2}, ${param3}`)
  }
}
