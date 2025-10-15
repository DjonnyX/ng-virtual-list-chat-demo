import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
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
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  data = input<IVirtualListItem<IItemData> | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IMessageParams>();

  searchPattern = input<Array<string>>([]);

  substarateMode: Signal<MessageSubstarateMode>;

  substrateType = signal<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IItemData> }>();

  changeValue = output<string>();

  editing = signal<boolean>(false);

  strokeColor = signal<GradientColor | undefined>(undefined);

  classes = input.required<{ [className: string]: boolean; }>();

  private _themeService = inject(ThemeService);

  private _resizeObserver: ResizeObserver;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || DEFAULT_SIZE,
    height: this._container()?.nativeElement?.offsetHeight || DEFAULT_SIZE,
  });

  @HostBinding('class')
  get hostClasses(): { [key: string]: boolean } {
    return this.classes();
  }
  someCondition = true;

  private _onContainerResizeHandler = () => {
    const data = this.data();
    if (data) {
      const el = this._container()?.nativeElement as HTMLDivElement;
      if (el && el.offsetWidth && el.offsetHeight) {
        this.bounds.set({ width: el.offsetWidth || DEFAULT_SIZE, height: el.offsetHeight || DEFAULT_SIZE });
      }
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);
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
    const container = this._container()?.nativeElement;
    if (container) {
      this._resizeObserver.observe(container);
    }
  }

  onTextAreaClickHandler(e: Event) {
    e.stopImmediatePropagation();
  }

  onEditedTextHandler(value: string, item: IVirtualListItem<IItemData>) {
    (item as IVirtualListItem<IItemData & { tmpName: string }>).tmpName = value;
    this.changeValue.emit(value);
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
