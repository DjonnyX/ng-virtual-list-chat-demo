import { CommonModule } from '@angular/common';
import { Component, computed, input, output, Signal } from '@angular/core';
import { LongPressDirective } from '@shared/directives';
import { IRenderVirtualListItemConfig } from '@shared/components/ng-virtual-list/lib/models/render-item-config.model';
import { IDisplayObjectMeasures, ISize, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IItemData } from '@mock/const/collection';
import { MessageComponent } from '../message/message.component';
import { IMessageParams } from '../message/interfaces';
import { IS_FIREFOX } from '@shared/components/ng-virtual-list/lib/utils/browser';

const CLASS_IN = 'in', CLASS_OUT = 'out', CLASS_SIMPLE = 'simple', CLASS_END_OF_MESSAGES = 'end-of-messages',
  CLASS_REMOVAL = 'removal', CLASS_DELETED = 'deleted', CLASS_ANIMATE = 'animate', CLASS_EDITED = 'edited',
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused', CLASS_FIRST_IN_GROUP = 'first-in-group', CLASS_FIREFOX = 'firefox',
  CLASS_LAST_IN_GROUP = 'last-in-group', CLASS_HAS_MULTICONTENT = 'has-multicontent', DATA_PROP_IMAGE = 'image',
  DATA_PROP_REMOVAL = 'removal', DATA_PROP_DELETED = 'deleted', DATA_PROP_ANIMATE = 'animate', CONFIG_PROP_SELECTED = 'selected',
  CONFIG_PROP_FOCUSED = 'focused';

@Component({
  selector: 'message-box',
  imports: [CommonModule, MessageComponent, LongPressDirective],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent {
  data = input<IVirtualListItem<IItemData> | null>(null);

  prevData = input<IVirtualListItem<IItemData> | null>(null);

  nextData = input<IVirtualListItem<IItemData> | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  searchPattern = input<Array<string>>([]);

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData> }>();

  edit = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean }>();

  delete = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData>, config: IRenderVirtualListItemConfig, measures: ISize }>();

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IMessageParams>;

  constructor() {
    this.params = computed(() => {
      const data = this.data(), prevData = this.prevData(), nextData = this.nextData();
      return {
        isIncoming: data?.['incomType'] === 'in',
        isOutgoing: data?.['incomType'] === 'out',
        prevIsIncoming: prevData?.['incomType'] === 'in',
        prevIsOutgoing: prevData?.['incomType'] === 'out',
        nextIsIncoming: nextData?.['incomType'] === 'in',
        nextIsOutgoing: nextData?.['incomType'] === 'out',
        type: data?.['type'],
        prevType: prevData?.['type'],
        nextType: nextData?.['type'],
      };
    });

    this.classes = computed(() => {
      const params = this.params(), data = this.data(), config = this.config(),
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

  onTextEditedHandler(event: { nativeEvent: Event, item: IVirtualListItem<IItemData> }) {
    this.editedText.emit(event);
  }

  onEditItemHandler(event: { nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean }) {
    this.edit.emit(event);
  }

  onDeleteItemHandler(nativeEvent: Event, item: IVirtualListItem<IItemData>, config: IRenderVirtualListItemConfig, measures: ISize) {
    this.delete.emit({ nativeEvent, item: item!, config: config!, measures: measures! });
  }
}
