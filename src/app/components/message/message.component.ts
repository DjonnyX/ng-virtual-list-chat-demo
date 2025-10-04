import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, computed, DestroyRef, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { delay, of, switchMap, tap } from 'rxjs';
import { MessageSubstrateComponent, SubstarateMode, SubstarateModes } from '../message-substrate/message-substrate.component';
import { IItemData } from '../../const/collection';
import { ISize, IVirtualListItem } from '../ng-virtual-list/public-api';
import { IRenderVirtualListItemConfig } from '../ng-virtual-list/lib/models/render-item-config.model';
import { MessageBottomBarComponent } from '../message-bottom-bar/message-bottom-bar.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export interface IMessageParams {
  type: string;
  prevType: string;
  nextType: string;
  isIncoming: boolean;
  isOutgoing: boolean;
  prevIsIncoming: boolean;
  prevIsOutgoing: boolean;
  nextIsIncoming: boolean;
  nextIsOutgoing: boolean;
}

@Component({
  selector: 'message',
  imports: [CommonModule, EditableTextComponent, MessageSubstrateComponent, MessageBottomBarComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  host: {
    'class': 'message',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageComponent implements AfterViewInit, OnDestroy {
  data = input<IVirtualListItem<IItemData> | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<ISize | null>(null);

  params = input.required<IMessageParams>();

  searchPattern = input<Array<string>>([]);

  substarateMode: Signal<SubstarateMode>;

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData> }>();

  edit = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean }>();

  editing = signal<boolean>(false);

  classes = input.required<{ [className: string]: boolean; }>();

  private _content = viewChild<ElementRef<HTMLDivElement>>('content');

  private _resizeObserver: ResizeObserver;

  private _destroyRef = inject(DestroyRef);

  bounds = signal<ISize>({ width: this._content()?.nativeElement?.offsetWidth ?? 0, height: this._content()?.nativeElement?.offsetHeight ?? 0 });

  @HostBinding('class')
  get hostClasses(): { [key: string]: boolean } {
    return this.classes();
  }
  someCondition = true;

  private _onContentResizeHandler = () => {
    const data = this.data();
    if (data) {
      const el = this._content()?.nativeElement as HTMLDivElement;
      if (el && el.offsetWidth && el.offsetHeight) {
        this.bounds.set({ width: el.offsetWidth, height: el.offsetHeight });
      }
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContentResizeHandler);

    toObservable(this.data).pipe(
      takeUntilDestroyed(),
      switchMap(data => {
        if (data && data.edited) {
          return of(data).pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => {
              this.editing.set(false);
            }),
            delay(100),
          );
        }
        return of(data);
      }),
      takeUntilDestroyed(this._destroyRef),
      tap(data => {
        this.editing.set(data?.edited === true);
      }),
    ).subscribe();

    this.substarateMode = computed(() => {
      const params = this.params(), { isIncoming: isIn, prevIsIncoming: isPrevIn } = params;
      if (isIn === isPrevIn) {
        return isIn ? SubstarateModes.LEFT : SubstarateModes.RIGHT;
      }
      return isIn ? SubstarateModes.IN_LEFT : SubstarateModes.IN_RIGHT;
    });
  }

  ngAfterViewInit(): void {
    const content = this._content()?.nativeElement;
    if (content) {
      this._resizeObserver.observe(content);
    }
  }

  onTextAreaClickHandler(e: Event) {
    e.stopImmediatePropagation();
  }

  onEditedTextHandler(nativeEvent: Event, item: IVirtualListItem<IItemData>) {
    this.editedText.emit({ nativeEvent, item });
  }

  onEditItemHandler(nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean) {
    this.edit.emit({ nativeEvent, item, selected });
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
