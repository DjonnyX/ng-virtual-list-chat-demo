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

  onClickHandler(item: IRenderVirtualListItem | undefined) {
    if (item) {
      console.info(`Click: (ID: ${item.data.id}) Item ${item.data.name}`);
    }
  }

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

  onInfo(params: Array<any>) {
    const [param1, param2, param3] = params;
    this.title.set(`${param1}, ${param2}, ${param3}`)
  }
}
