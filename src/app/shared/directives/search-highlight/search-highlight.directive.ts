import { Directive, SimpleChanges, Renderer2, ElementRef, input, inject, OnChanges, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
    selector: '[searchHighlight]'
})
export class SearchHighlightDirective implements OnChanges {
    searchedWords = input<Array<string>>();

    text = input<string | undefined>();

    substringClass = input<string>('search-substring');

    private _elementRef = inject(ElementRef);

    private _renderer = inject(Renderer2);

    private _sanitizer = inject(DomSanitizer);

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        const s = this.searchedWords();
        if (!s || !s.length || !this.substringClass()) {
            const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(this.text() ?? ''));
            this._renderer.setProperty(this._elementRef.nativeElement, 'innerHTML', sanitized);
            return;
        }

        const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(this.getFormattedText()));
        this._renderer.setProperty(
            this._elementRef.nativeElement,
            'innerHTML',
            sanitized,
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
