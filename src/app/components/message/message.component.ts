import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, Signal, viewChild, ViewEncapsulation } from '@angular/core';
import { MessageSubstrateComponent, SubstarateMode } from '../message-substrate/message-substrate.component';
import { IItemData } from '../../const/collection';
import { Id, ISize } from '../ng-virtual-list/public-api';
import { IRenderVirtualListItemConfig } from '../ng-virtual-list/lib/models/render-item-config.model';
import { SearchHighlightDirective } from '../../directives/search-highlight.directive';
import { ClickOutsideDirective } from '../../directives';
import { MessageBottomBarComponent } from '../message-bottom-bar/message-bottom-bar.component';

const IMAGE_HEIGHT = 72,
  MESSAGE_PADDING = 26,
  BOTTOM_BAR = 16,
  GAP = 2;

@Component({
  selector: 'message',
  imports: [CommonModule, MessageSubstrateComponent, MessageBottomBarComponent, SearchHighlightDirective, ClickOutsideDirective],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  host: {
    'class': 'message',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageComponent implements OnDestroy {
  data = input<IItemData & {
    image?: string;
    edited?: boolean;
    deleted?: boolean;
    animate?: boolean;
  } | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<ISize | null>(null);

  isIncoming = input<boolean>(false);

  isOutgoing = input<boolean>(false);

  searchPattern = input<Array<string>>([]);

  substarateMode: Signal<SubstarateMode>;

  outsideClick = output<{ nativeEvent: Event, item: IItemData | undefined, selected: boolean }>();

  editingClose = output<{ target: any; item: IItemData & { id: Id }; }>();

  editedText = output<{ nativeEvent: Event, item: IItemData | undefined }>();

  edit = output<{ nativeEvent: Event, item: IItemData | undefined, selected: boolean }>();

  private _content = viewChild<ElementRef<HTMLDivElement>>('content');

  private _resizeObserver: ResizeObserver;

  bounds = signal<ISize>({ width: this._content()?.nativeElement?.offsetWidth ?? 0, height: this._content()?.nativeElement?.offsetHeight ?? 0 });

  @HostBinding('class')
  get hostClasses(): { [key: string]: boolean } {
    return this.classes();
  }
  someCondition = true;

  classes: Signal<{ [className: string]: boolean }>;

  private _onContentResizeHandler = () => {
    const el = this._content()?.nativeElement as HTMLDivElement;
    this.bounds.set({ width: el.offsetWidth, height: el.offsetHeight });
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContentResizeHandler);

    effect(() => {
      const content = this._content()?.nativeElement;
      if (content) {
        this._resizeObserver.observe(content);
      }
    })

    this.substarateMode = computed(() => {
      const isIn = this.isIncoming();
      return isIn ? 'left' : 'right';
    });

    this.classes = computed(() => {
      const isIn = this.isIncoming(), isOut = this.isOutgoing(), d = this.data(), c = this.config();
      return {
        'in': isIn, 'out': isOut, 'deleted': d?.deleted == true, 'animate': d?.animate == true,
        'edited': d?.edited == true, 'selected': c?.['selected'], focused: c?.['focused'],
      };
    });
  }

  getContentHeight(v: number, hasImage: boolean = false) {
    return Math.round(v - MESSAGE_PADDING - BOTTOM_BAR - GAP - 4 - (hasImage ? IMAGE_HEIGHT : 0));
  }

  onKeyDownHandler(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.stopImmediatePropagation();
    }
  }

  onTextAreaClickHandler(e: Event) {
    e.stopImmediatePropagation();
  }

  onOutsideClickHandler(nativeEvent: Event, item: IItemData | undefined, selected: boolean) {
    this.outsideClick.emit({ nativeEvent, item, selected });
  }

  onEditingCloseHandler(data: { target: any; item: IItemData & { id: Id }; }) {
    this.editingClose.emit(data);
  }

  onEditedTextHandler(nativeEvent: Event, item: IItemData | undefined) {
    this.editedText.emit({ nativeEvent, item });
  }

  onEditItemHandler(nativeEvent: Event, item: IItemData | undefined, selected: boolean) {
    this.edit.emit({ nativeEvent, item, selected });
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
