import { Component, computed, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchHighlightDirective } from '../../directives/search-highlight.directive';
import { formatText } from '../../shared/utils';

const DEFAULT_SEARCH_SUBSTRING_CLASS = 'search-substring';

@Component({
  selector: 'editable-text',
  imports: [CommonModule, SearchHighlightDirective],
  templateUrl: './editable-text.component.html',
  styleUrl: './editable-text.component.scss',
})
export class EditableTextComponent implements OnDestroy {
  readonlyText = viewChild<ElementRef<HTMLSpanElement>>('readonlyText');

  editing = input<boolean>(false);

  text = input<string>();

  searchSubstringClass = input<string>(DEFAULT_SEARCH_SUBSTRING_CLASS);

  searchPattern = input<Array<string>>();

  height = signal<number>(0);

  textAreaClick = output<Event>();

  textClick = output<Event>();

  changeText = output<Event>();

  keydown = output<KeyboardEvent>();

  formattedText: Signal<string>;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _onResizeHandler = () => {
    if (this.readonlyText()) {
      const el = this._elementRef.nativeElement as HTMLDivElement;
      this.height.set(el.offsetHeight);
    }
  };

  private _resizeObserver = new ResizeObserver(this._onResizeHandler);

  constructor() {
    this._resizeObserver.observe(this._elementRef.nativeElement);

    this.formattedText = computed(() => {
      const text = this.text(),
        formatted = formatText(text);
      return formatted;
    });
  }

  onTextAreaClickHandler(e: Event) {
    this.textAreaClick.emit(e);
  }

  onTextClickHandler(e: Event) {
    this.textClick.emit(e);
  }

  onKeyDownHandler(e: KeyboardEvent) {
    e.stopImmediatePropagation();

    this.keydown.emit(e);
  }

  onChangeHandler(e: Event) {
    this.changeText.emit(e);
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
