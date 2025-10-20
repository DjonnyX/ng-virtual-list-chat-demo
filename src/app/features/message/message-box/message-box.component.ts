import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, output, signal, Signal } from '@angular/core';
import { LongPressDirective } from '@shared/directives';
import { Id, IDisplayObjectConfig, IDisplayObjectMeasures, ISize, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IMessageItemData } from "@shared/models/message";
import { IS_FIREFOX } from '@shared/components/ng-virtual-list/lib/utils/browser';
import { MessageButtonSaveState, MessageButtonSaveStates, MessageMenuButtonComponent, MessageSaveButtonComponent } from '@entities/message';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { MessageComponent } from '../message/message.component';
import { IMessageParams } from '../message/interfaces';
import { ContextMenuComponent, IContextMenuCollection } from '@shared/components/context-menu';
import { GradientColorPositions } from '@shared/types';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { ButtonPresets } from '@shared/theming';
import { DialogPresets } from '@shared/theming/themes/presets';

const CLASS_IN = 'in', CLASS_OUT = 'out', CLASS_SIMPLE = 'simple', CLASS_END_OF_MESSAGES = 'end-of-messages',
  CLASS_REMOVAL = 'removal', CLASS_DELETED = 'deleted', CLASS_ANIMATE = 'animate', CLASS_EDITED = 'edited',
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused', CLASS_FIRST_IN_GROUP = 'first-in-group', CLASS_FIREFOX = 'firefox',
  CLASS_LAST_IN_GROUP = 'last-in-group', CLASS_HAS_MULTICONTENT = 'has-multicontent', DATA_PROP_IMAGE = 'image',
  DATA_PROP_REMOVAL = 'removal', DATA_PROP_DELETED = 'deleted', DATA_PROP_ANIMATE = 'animate', CONFIG_PROP_SELECTED = 'selected',
  CONFIG_PROP_FOCUSED = 'focused';

enum ContextMenuItemIds {
  EDIT = 'edit',
  DELETE = 'delete',
  CANCEL = 'cancel',
  QUOTE = 'quote',
}

const CONTEXT_MENU_NORMAL: IContextMenuCollection = [
  {
    id: ContextMenuItemIds.EDIT,
    name: 'edit',
  },
  {
    id: ContextMenuItemIds.QUOTE,
    name: 'quote',
  },
  {
    id: ContextMenuItemIds.DELETE,
    name: 'delete',
  },
],
  CONTEXT_MENU_EDITING: IContextMenuCollection = [
    {
      id: ContextMenuItemIds.CANCEL,
      name: 'cancel',
    },
    {
      id: ContextMenuItemIds.QUOTE,
      name: 'quote',
    },
    {
      id: ContextMenuItemIds.DELETE,
      name: 'delete',
    },
  ];

interface IDeleteEventData {
  nativeEvent: Event;
  item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>;
  config: IDisplayObjectConfig;
  measures: ISize;
}

@Component({
  selector: 'message-box',
  imports: [CommonModule, MessageComponent, LongPressDirective, MessageMenuButtonComponent, MessageSaveButtonComponent,
    CdkMenuTrigger, ContextMenuComponent,
  ],
  providers: [DialogService],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent {
  data = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  prevData = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  nextData = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  config = input<IDisplayObjectConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  searchPattern = input<Array<string>>([]);

  edit = output<{ nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean }>();

  edited = output<{ nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, value: string | undefined }>();

  editingCancel = output<void>();

  changeText = output<string>();

  delete = output<IDeleteEventData>();

  private tmpValue = signal<string | undefined>(undefined);

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IMessageParams>;

  editingState: Signal<MessageButtonSaveState>;

  isSaving: Signal<boolean>;

  isDeleting: Signal<boolean>;

  contextMenuItems: Signal<IContextMenuCollection>;

  fillPositions: Signal<GradientColorPositions>;

  isMessageValid: Signal<boolean>;

  private _dialogService = inject(DialogService);

  private _destroyRef = inject(DestroyRef);

  constructor() {
    this.params = computed(() => {
      const data = this.data(), prevData = this.prevData(), nextData = this.nextData();
      return {
        isIncoming: data?.data?.incomType === 'in',
        isOutgoing: data?.data?.incomType === 'out',
        prevIsIncoming: prevData?.data?.incomType === 'in',
        prevIsOutgoing: prevData?.data?.incomType === 'out',
        nextIsIncoming: nextData?.data?.incomType === 'in',
        nextIsOutgoing: nextData?.data?.incomType === 'out',
        type: data?.data.type,
        prevType: prevData?.data.type,
        nextType: nextData?.data.type,
      };
    });

    this.fillPositions = computed(() => {
      const measures = this.measures();
      return [`${measures?.absoluteStartPositionPercent ?? 0}`, `${(measures?.absoluteEndPositionPercent ?? 0)}`]
    })

    this.contextMenuItems = computed(() => {
      return this.data()?.edited ? [...CONTEXT_MENU_EDITING] : [...CONTEXT_MENU_NORMAL];
    });

    this.isMessageValid = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return (!!data && data.data.name?.length > 0) && (tmpValue === undefined || tmpValue.length > 0);
    });

    this.isSaving = computed(() => {
      const data = this.data();
      return data?.processing === true;
    });

    this.isDeleting = computed(() => {
      const data = this.data();
      return data?.deleting === true || data?.deleted === true || data?.removal === true;
    });

    this.editingState = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return tmpValue !== data?.data.name ? MessageButtonSaveStates.SEND : MessageButtonSaveStates.CANCEL;
    });

    this.classes = computed(() => {
      const params = this.params(), data = this.data(), config = this.config() as any,
        isIn = params.isIncoming, isOut = params.isOutgoing, isPrevIn = params.prevIsIncoming, isPrevOut = params.prevIsOutgoing,
        isNextIn = params.nextIsIncoming, isNextOut = params.nextIsOutgoing, firstInGroup = params.prevType !== params.type,
        lastInGroup = params.nextType !== params.type;
      return {
        [CLASS_IN]: isIn, [CLASS_OUT]: isOut, [CLASS_SIMPLE]: (isIn && isPrevIn) || (isOut && isPrevOut), [CLASS_DELETED]: data?.[DATA_PROP_DELETED] == true,
        [CLASS_REMOVAL]: data?.[DATA_PROP_REMOVAL] == true, [CLASS_ANIMATE]: data?.[DATA_PROP_ANIMATE] == true, [CLASS_END_OF_MESSAGES]: (isIn && !isNextIn) || (isOut && !isNextOut),
        [CLASS_FIRST_IN_GROUP]: firstInGroup, [CLASS_LAST_IN_GROUP]: lastInGroup, [CLASS_EDITED]: data?.edited == true, [CLASS_FIREFOX]: IS_FIREFOX,
        [CLASS_SELECTED]: config?.[CONFIG_PROP_SELECTED], [CLASS_FOCUSED]: config?.[CONFIG_PROP_FOCUSED], [CLASS_HAS_MULTICONTENT]: data?.[DATA_PROP_IMAGE] !== undefined,
      };
    });
  }

  onEditItemHandler(event: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean) {
    this.edit.emit({ nativeEvent: event, item, selected });
  }

  onDeleteItemHandler(nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, measures: ISize) {
    const data: IDeleteEventData = { nativeEvent, item: item!, config: config!, measures: measures! };
    this._dialogService.open<IDeleteEventData | undefined>({
      title: "Attention",
      message: "Are you sure you want to delete the message?",
      actions: [
        {
          action: "cancel",
          name: "cancel",
          preset: ButtonPresets.CANCEL,
          data: undefined,
        },
        {
          action: "delete",
          name: "delete",
          preset: ButtonPresets.SUCCESS,
          data,
        },
      ],
      preset: DialogPresets.PRIMARY,
    }).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(data => !!data),
      tap(data => {
        this.delete.emit(data);
      }),
    ).subscribe();
  }

  onMenuClickHandler(e: Event) {
    e.stopImmediatePropagation();
  }

  onSaveHandler(e: Event, config: IDisplayObjectConfig, state: MessageButtonSaveState) {
    const item = this.data();
    if (item) {
      switch (state) {
        case MessageButtonSaveStates.SEND: {
          this.edited.emit({ nativeEvent: e, item, config, value: item.tmpName });
          break;
        }
        case MessageButtonSaveStates.CANCEL: {
          e.stopImmediatePropagation();
          this.editingCancel.emit();
          config.select(false);
          break;
        }
      }
    }
  }

  onCancelEditingHandler(e: Event, config: IDisplayObjectConfig) {
    this.editingCancel.emit();
    config.select(false);
  }

  onMessageChangeValueHandler(e: string) {
    this.tmpValue.set(e);
    this.changeText.emit(e);
  }

  onClickContextMenuHandler({ id, event }: { id: Id, event: Event }, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>,
    config: IDisplayObjectConfig, measures: ISize) {
    switch (id) {
      case ContextMenuItemIds.EDIT: {
        this.onEditItemHandler(event, item, config.selected);
        break;
      }
      case ContextMenuItemIds.CANCEL: {
        this.onCancelEditingHandler(event, config);
        break;
      }
      case ContextMenuItemIds.QUOTE: {
        // 
        break;
      }
      case ContextMenuItemIds.DELETE: {
        this.onDeleteItemHandler(event, item, config, measures);
        break;
      }
    }
  }
}
