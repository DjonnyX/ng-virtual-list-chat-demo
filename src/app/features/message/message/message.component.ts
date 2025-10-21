import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, delay, tap } from 'rxjs';
import {
  MessageSubstrateComponent, MessageSubstarateMode, MessageSubstarateModes, MessageBottomBarComponent, EditableTextComponent,
  MessageSubstarateStyle, MessageSubstarateStyles,
} from '@entities/message';
import { IDisplayObjectMeasures, ISize, IVirtualListItem } from '@shared/components/ng-virtual-list';
import { IRenderVirtualListItemConfig } from '@shared/components/ng-virtual-list/lib/models/render-item-config.model';
import { IMessageItemData } from "@shared/models/message";
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { IMessageParams } from './interfaces/message-params';
import { ITheme } from '@shared/theming';

const DEFAULT_SIZE = 200,
  DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgba(195, 0, 255, 0.17)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'],
  CLASS_REMOVAL = 'removal', CLASS_DELETED = 'deleted', CLASS_ANIMATE = 'animate', CLASS_EDITED = 'edited',
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused';

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

  data = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  config = input<IRenderVirtualListItemConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IMessageParams>();

  searchPattern = input<Array<string>>([]);

  classes = input.required<{ [className: string]: boolean; }>();

  fillPositions = input<GradientColorPositions>();

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IMessageItemData> }>();

  changeValue = output<string>();

  substarateMode: Signal<MessageSubstarateMode>;

  substrateType = signal<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  editing = signal<boolean>(false);

  strokeColor = signal<GradientColor | undefined>(undefined);

  fillColors = signal<GradientColor>(DEFAULT_FILL_COLOR);

  rippleColor = signal<Color | undefined>(undefined);

  theme: Signal<ITheme | undefined>;

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
    const d = this.data();
    if (d) {
      const el = this._container()?.nativeElement as HTMLDivElement;
      if (el && el.offsetWidth && el.offsetHeight) {
        this.bounds.set({ width: el.offsetWidth || DEFAULT_SIZE, height: el.offsetHeight || DEFAULT_SIZE });
      }
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    this.theme = toSignal(this._themeService.$theme);
    const $data = toObservable(this.data),
      $params = toObservable(this.params);

    combineLatest([$data, $params]).pipe(
      takeUntilDestroyed(),
      delay(1),
      tap(() => {
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    effect(() => {
      const data = this.data(), currentTheme = this.theme();
      if (data) {
        if (data?.processing) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(currentTheme?.chat.messages.message.styles.processing.stroke ?? DEFAULT_STROKE_COLOR);
        } else if (data?.removal) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(currentTheme?.chat.messages.message.styles.removing.stroke ?? DEFAULT_STROKE_COLOR);
        } else {
          this.substrateType.set(MessageSubstarateStyles.NONE);
          this.strokeColor.set(DEFAULT_STROKE_COLOR);
        }
      } else {
        this.substrateType.set(MessageSubstarateStyles.NONE);
        this.strokeColor.set(DEFAULT_STROKE_COLOR);
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme?.chat.messages.message.content);
        if (preset) {
          this.rippleColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), currentTheme = this.theme(), containerElement = this._container()?.nativeElement;
      if (containerElement) {
        const preset = this._themeService.getPreset(currentTheme?.chat.messages.message.content);
        if (preset) {
          if (classes[CLASS_REMOVAL] && classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.removalSelected.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.removalSelected.color;
          } else if (classes[CLASS_REMOVAL]) {
            this.fillColors.set(preset.removal.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.removal.color;
          } else if (classes[CLASS_SELECTED] && classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focusedSelected.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.focusedSelected.color;
          } else if (classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.selected.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.selected.color;
          } else if (classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.focused.color;
          } else {
            this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
            containerElement.style.color = preset.normal.color;
          }
        }
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

  onEditedTextHandler(value: string, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>) {
    item.tmpName = value;
    this.changeValue.emit(value);
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
