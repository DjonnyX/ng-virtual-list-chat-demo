import { Directive, Renderer2, ElementRef, input, inject, SecurityContext, effect } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { COMPILED_URL_PATTERN } from '@shared/utils/text/format-text.util';

const INNER_HTML = 'innerHTML';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
@Directive({
    selector: '[searchHighlight]'
})
export class SearchHighlightDirective {
    searchedWords = input<Array<string>>();

    private _previousValue: string | undefined;

    text = input<string | undefined>();

    simpleText = input<string | undefined>();

    substringClass = input<string>('search-substring');

    private _elementRef = inject(ElementRef);

    private _renderer = inject(Renderer2);

    private _sanitizer = inject(DomSanitizer);

    constructor() {
        effect(() => {
            const text = this.text() ?? '', s = this.searchedWords(), substringClass = this.substringClass();
            if (!s || !s.length || !substringClass) {
                const value = text;
                if (this._previousValue === value) {
                    return;
                }

                this._previousValue = value;
                const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(value));
                this._renderer.setProperty(this._elementRef.nativeElement, INNER_HTML, sanitized);
                return;
            }

            const value = this.getFormattedText(text, s, substringClass);
            if (this._previousValue === value) {
                return;
            }
            this._previousValue = value;
            const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(value));
            this._renderer.setProperty(
                this._elementRef.nativeElement,
                INNER_HTML,
                sanitized,
            );
        });
    }

    getFormattedText(text: string, searchWords: Array<string> | undefined, substringClass: string) {
        const s = searchWords, t = text ?? '';
        if (!s || (s.length === 1 && (s[0] === ''))) {
            return t;
        }
        const regexp = new RegExp(`(${s.join('|')})`, 'g');
        return t?.replaceAll(COMPILED_URL_PATTERN, '')?.replace(regexp, `<span class="${substringClass}">$1</span>`);
    }
}
