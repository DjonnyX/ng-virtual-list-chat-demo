import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, of, switchMap, tap } from 'rxjs';
import {
  MessageSubstrateComponent, MessageSubstarateMode, MessageSubstarateModes, MessageBottomBarComponent, EditableTextComponent,
  MessageSubstarateStyle, MessageSubstarateStyles,
} from '@entities/message';
import { IDisplayObjectMeasures, ISize, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IRenderVirtualListItemConfig } from '@shared/components/ng-virtual-list/lib/models/render-item-config.model';
import { IItemData } from '@mock/const/collection';
import { IMessageParams } from './interfaces/message-params';
import { GradientColor } from '@shared/types';
import { ThemeService } from '@shared/theming';

const DEFAULT_SIZE = 200;

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgba(195, 0, 255, 0.17)'];

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
  private _content = viewChild<ElementRef<HTMLDivElement>>('content');

  data = input<IVirtualListItem<IItemData> | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IMessageParams>();

  searchPattern = input<Array<string>>([]);

  substarateMode: Signal<MessageSubstarateMode>;

  substrateType = signal<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData> }>();

  edit = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData>, selected: boolean }>();

  editing = signal<boolean>(false);

  strokeColor = signal<GradientColor | undefined>(undefined);

  classes = input.required<{ [className: string]: boolean; }>();

  private _themeService = inject(ThemeService);

  private _resizeObserver: ResizeObserver;

  private _destroyRef = inject(DestroyRef);

  bounds = signal<ISize>({
    width: this._content()?.nativeElement?.offsetWidth || DEFAULT_SIZE,
    height: this._content()?.nativeElement?.offsetHeight || DEFAULT_SIZE,
  });

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
        this.bounds.set({ width: el.offsetWidth || DEFAULT_SIZE, height: el.offsetHeight || DEFAULT_SIZE });
      }
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContentResizeHandler);
    const theme = toSignal(this._themeService.$theme);

    effect(() => {
      const data = this.data(), currentTheme = theme();
      if (data) {
        if (data?.['processing']) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(currentTheme?.chat.messages.message.styles.processing.stroke ?? DEFAULT_STROKE_COLOR);
        } else if (data?.['removal']) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(currentTheme?.chat.messages.message.styles.removing.stroke ?? DEFAULT_STROKE_COLOR);
        } else if (data?.['saving']) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(currentTheme?.chat.messages.message.styles.loading.stroke ?? DEFAULT_STROKE_COLOR);
        } else {
          this.substrateType.set(MessageSubstarateStyles.NONE);
          this.strokeColor.set(DEFAULT_STROKE_COLOR);
        }
      } else {
        this.substrateType.set(MessageSubstarateStyles.NONE);
        this.strokeColor.set(DEFAULT_STROKE_COLOR);
      }
    });

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
        return isIn ? MessageSubstarateModes.LEFT : MessageSubstarateModes.RIGHT;
      }
      return isIn ? MessageSubstarateModes.IN_LEFT : MessageSubstarateModes.IN_RIGHT;
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
