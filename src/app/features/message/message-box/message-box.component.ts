import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, Signal } from '@angular/core';
import { LongPressDirective } from '@shared/directives';
import { IDisplayObjectConfig, IDisplayObjectMeasures, ISize, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IMessageItemData } from "@shared/models/message";
import { IS_FIREFOX } from '@shared/components/ng-virtual-list/lib/utils/browser';
import { MessageButtonSaveState, MessageButtonSaveStates, MessageMenuButtonComponent, MessageSaveButtonComponent } from '@entities/message';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { MessageComponent } from '../message/message.component';
import { IMessageParams } from '../message/interfaces';

const CLASS_IN = 'in', CLASS_OUT = 'out', CLASS_SIMPLE = 'simple', CLASS_END_OF_MESSAGES = 'end-of-messages',
  CLASS_REMOVAL = 'removal', CLASS_DELETED = 'deleted', CLASS_ANIMATE = 'animate', CLASS_EDITED = 'edited',
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused', CLASS_FIRST_IN_GROUP = 'first-in-group', CLASS_FIREFOX = 'firefox',
  CLASS_LAST_IN_GROUP = 'last-in-group', CLASS_HAS_MULTICONTENT = 'has-multicontent', DATA_PROP_IMAGE = 'image',
  DATA_PROP_REMOVAL = 'removal', DATA_PROP_DELETED = 'deleted', DATA_PROP_ANIMATE = 'animate', CONFIG_PROP_SELECTED = 'selected',
  CONFIG_PROP_FOCUSED = 'focused';

@Component({
  selector: 'message-box',
  imports: [CommonModule, MessageComponent, LongPressDirective, MessageMenuButtonComponent, MessageSaveButtonComponent,
    CdkMenuTrigger, CdkMenu, CdkMenuItem,
  ],
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

  delete = output<{ nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, measures: ISize }>();

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IMessageParams>;

  editingState: Signal<MessageButtonSaveState>;

  isSaving: Signal<boolean>;

  private tmpValue = signal<string | undefined>(undefined);

  isMessageValid: Signal<boolean>;

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

    this.isMessageValid = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return (!!data && data.data.name?.length > 0) && (tmpValue === undefined || tmpValue.length > 0);
    });

    this.isSaving = computed(() => {
      const data = this.data();
      return data?.['processing'] === true;
    });

    this.editingState = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return tmpValue !== data?.['name'] ? MessageButtonSaveStates.SEND : MessageButtonSaveStates.CANCEL;
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
    this.delete.emit({ nativeEvent, item: item!, config: config!, measures: measures! });
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
}
