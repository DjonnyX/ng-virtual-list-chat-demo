import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, effect, ElementRef, inject, OnDestroy, Signal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, filter, map, of, Subject, switchMap, tap, } from 'rxjs';
import { MenuButtonComponent, MessageSearchComponent } from '@entities/header';
import { IRenderVirtualListItem, ISize, IVirtualListItem } from 'ng-virtual-list';
import { DrawerComponent, DockMode } from "@shared/components";
import { ClickOutsideService } from '@shared/directives';
import { MessagesComponent } from "@widgets/messages/messages/messages.component";
import { GroupsComponent } from "@widgets/groups/groups/groups.component";
import { MessageService } from '@widgets/messages';
import { ITheme } from '@shared/theming';
import { ThemeService } from '@shared/theming';
import { generateChatCollection } from '@mock/const';
import { IMessageItemData } from '@shared/models/message';
import { LocaleSensitiveDirective } from '@shared/localization';
import { MessaageCreatorComponent } from '@widgets/message/messaage-creator/messaage-creator.component';
import { MessagesService } from '@widgets/messages/messages.service';
import { MessagesMockService } from '@widgets/messages/messages-mock.service';
import { MessagesNotificationService } from '@widgets/messages/messages-notification.service';
import { MessagesNotificationMockService } from '@widgets/messages/messages-notification-mock.service';
import { MessagesNotificationWSService } from '@widgets/messages/messages-notification-ws.service';
import { MessagesHttpService } from '@widgets/messages/messages-http.service';
import { environment } from '@environments/environment';
import { IMediaParams, MediaService } from '@shared/directives/media';

const DEFAULT_MENU_SIZE = 320,
  COLLAPSIBLE_MENU_SIZES = ['xxs', 'xs', 's', 'sm', 'm', 'xm', 'xxm', 'l', 'xl'],
  MENU_SIZES: IMediaParams = {
    'xxs': 'col-12',
    'xs': 'col-12',
    's': 'col-12',
    'sm': 'col-12',
    'm': 'col-12',
    'xm': 'col-12',
    'xxm': DEFAULT_MENU_SIZE,
    'l': DEFAULT_MENU_SIZE,
    'xl': DEFAULT_MENU_SIZE,
    'xxl': DEFAULT_MENU_SIZE,
    undefined: DEFAULT_MENU_SIZE,
  };

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LocaleSensitiveDirective, MenuButtonComponent, MessageSearchComponent, DrawerComponent,
    MessagesComponent, GroupsComponent, MessaageCreatorComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService,
    { provide: MessagesService, useClass: environment.useMock ? MessagesMockService : MessagesHttpService },
    { provide: MessagesNotificationService, useClass: environment.useMock ? MessagesNotificationMockService : MessagesNotificationWSService },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ChatComponent implements OnDestroy {
  protected _toolbar = viewChild<ElementRef<HTMLDivElement>>('toolbar');

  protected _messageCreator = viewChild<ElementRef<HTMLDivElement>>('messageCreator');

  protected _header = viewChild<ElementRef<HTMLDivElement>>('header');

  protected _creator = viewChild<MessaageCreatorComponent>('creator');

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  isCreating = signal<boolean>(false);

  menuOpened = signal<boolean>(false);

  menuSize = signal<number>(DEFAULT_MENU_SIZE);

  dockMode: Signal<DockMode.LEFT | DockMode.NONE>;

  dockLeftCollapsible = signal<boolean>(true);

  theme: Signal<ITheme | undefined>;

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string | undefined>(undefined);

  private _messagesService = inject(MessagesService);

  private _messageService = inject(MessageService);

  private _mediaService = inject(MediaService);

  private _themeService = inject(ThemeService);

  private _$send = new Subject<string>();
  protected $send = this._$send.asObservable();

  private _messageCreatorResizeObserver: ResizeObserver;

  messageCreatorBounds = signal<ISize>({
    width: this._messageCreator()?.nativeElement?.offsetWidth || 0,
    height: this._messageCreator()?.nativeElement?.offsetHeight || 0,
  });

  private _onMessageCreatorResizeHandler = () => {
    const el = this._messageCreator()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.messageCreatorBounds.set({ width: el.offsetWidth || 0, height: el.offsetHeight || 0 });
    }
  }

  private _toolbarResizeObserver: ResizeObserver;

  toolbarBounds = signal<ISize>({
    width: this._toolbar()?.nativeElement?.offsetWidth || 0,
    height: this._toolbar()?.nativeElement?.offsetHeight || 0,
  });

  private _onToolbarResizeHandler = () => {
    const el = this._toolbar()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.toolbarBounds.set({ width: el.offsetWidth || 0, height: el.offsetHeight || 0 });
    }
  }

  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._messageCreatorResizeObserver = new ResizeObserver(this._onMessageCreatorResizeHandler);

    this._toolbarResizeObserver = new ResizeObserver(this._onToolbarResizeHandler);

    this._mediaService.$changes.pipe(
      takeUntilDestroyed(),
      tap(({ size }) => {
        const val = this._mediaService.getMediaSize(MENU_SIZES) as number;
        this.menuSize.set(val !== undefined ? val : DEFAULT_MENU_SIZE);
        this.dockLeftCollapsible.set(size !== undefined && COLLAPSIBLE_MENU_SIZES.includes(size));
      }),
    ).subscribe();

    const $send = this.$send,
      $chatId = this._messageService.$chatId;

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== undefined),
      switchMap(chatId => {
        return $send.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(value => {
            this.isCreating.set(true);
            const msg: Omit<IVirtualListItem<IMessageItemData>, 'id' | 'mailed' | 'edited' | 'incomType' | 'type' | 'dateTime'> = {
              text: value,
            };
            return this._messagesService.createMessage(chatId, msg);
          }),
          takeUntilDestroyed(this._destroyRef),
          tap(msg => {
            if (!msg) {
              return;
            }
            this.isCreating.set(false);
            this._messageService.add(msg);
            this._creator()?.reset?.();
          }),
          catchError((err) => {
            console.error(`Create message error: ${err}`);
            this.isCreating.set(false);
            return of(undefined);
          }),
        );
      }),
    ).subscribe();

    const $messageCreator = toObservable(this._messageCreator).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    ), $toolbar = toObservable(this._toolbar).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $toolbar.pipe(
      takeUntilDestroyed(),
      tap(toolbar => {
        this._toolbarResizeObserver.observe(toolbar);
      }),
    ).subscribe();

    $messageCreator.pipe(
      takeUntilDestroyed(),
      tap(messageCreator => {
        this._messageCreatorResizeObserver.observe(messageCreator);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const dockLeftCollapsible = this.dockLeftCollapsible();
      if (dockLeftCollapsible) {
        this.menuOpened.set(false);
      }
    });

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

  onClickHandler(item: IRenderVirtualListItem<IMessageItemData> | undefined) {
    if (item) {
      console.info(`Click: (ID: ${item.data.id}) Item ${item.data.text}`);
    }
  }

  onGroupsCloseHandler() {
    this.menuOpened.set(false);
  }

  onGroupSelectHandler(item: IVirtualListItem) {
    this.menuOpened.set(false);
    this.title.set(item?.['text']);
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

  onSendMessageHandler(value: string) {
    this._$send.next(value);
  }

  ngOnDestroy(): void {
    if (this._messageCreatorResizeObserver) {
      this._messageCreatorResizeObserver.disconnect();
    }
    if (this._toolbarResizeObserver) {
      this._toolbarResizeObserver.disconnect();
    }
  }
}
