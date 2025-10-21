import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, inject, Signal, signal, viewChild, ViewEncapsulation } from '@angular/core';
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
import { ITheme } from '@shared/theming';
import { ThemeService } from '@shared/theming';
import { toSignal } from '@angular/core/rxjs-interop';

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
  protected _toolbar = viewChild<ElementRef<HTMLDivElement>>('toolbar');

  protected _header = viewChild<ElementRef<HTMLDivElement>>('header');

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  menuOpened = signal<boolean>(false);

  dockMode: Signal<DockMode.LEFT | DockMode.NONE>;

  theme: Signal<ITheme | undefined>;

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string | undefined>(undefined);

  private _messageService = inject(MessageService);

  private _themeService = inject(ThemeService);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), toolbar = this._toolbar()?.nativeElement;
      if (theme && toolbar) {
        const preset = this._themeService.getPreset(theme.chat.header);
        if (preset) {
          toolbar.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), header = this._header()?.nativeElement;
      if (theme && header) {
        const preset = this._themeService.getPreset(theme.chat.header);
        if (preset) {
          header.style.color = preset.color;
          header.style.fontSize = preset.fontSize;
        }
      }
    });

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

  onOpenMenuHandler(e: Event) {
    e.stopImmediatePropagation();

    this.menuOpened.update(v => !v);
  }

  onInfo(params: Array<any>) {
    const [param1, param2, param3] = params;
    this.title.set(`${param1}, ${param2}, ${param3}`)
  }
}
