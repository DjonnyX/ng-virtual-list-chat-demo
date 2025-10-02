import { Directive, SimpleChanges, Renderer2, ElementRef, input, inject, OnChanges } from '@angular/core';

@Directive({
    selector: '[searchHighlight]'
})
export class SearchHighlightDirective implements OnChanges {
    searchedWords = input<Array<string>>();

    text = input<string>();

    substringClass = input<string>('search-substring');

    private _elementRef = inject(ElementRef);

    private _renderer = inject(Renderer2);

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        const s = this.searchedWords();
        if (!s || !s.length || !this.substringClass()) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'innerHTML', this.text() ?? '');
            return;
        }

        this._renderer.setProperty(
            this._elementRef.nativeElement,
            'innerHTML',
            this.getFormattedText()
        );
    }

    getFormattedText() {
        const s = this.searchedWords(), t = this.text() ?? '';
        if (!s || (s.length === 1 && (s[0] === ''))) {
            return t;
        }
        const regexp = new RegExp(`(${s.join('|')})`, 'g');
        return t?.replace(regexp, `<span class="${this.substringClass()}">$1</span>`);
    }
}
