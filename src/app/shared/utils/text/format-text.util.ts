const SERVICE_WHITESPACE = '&__whitespace__;',
    SERVICE_COMPILED_URL = '&__url__;',
    URL_PATTERN = /(https?:\/\/(?:www\.|(?!www))[\w\d\-_?=,;\[\]&.][\w\d\-_?=,;\[\]&.]+[\w\d\-_?=,;\[\]&.]\.[\w\d\-_?=,;\[\]&.\/]{2,}|www\.[\w\d\-_?=,;\[\]&.][\w\d\-_?=,;\[\]&.]+[\w\d\-_?=,;\[\]&.\/]\.[^\w]{2,}|https?:\/\/(?:www\.|(?!www))[\w\d\-_?=,;\[\]&.]+\.[^\w]{2,}|www\.[\w\d\-_?=,;\[\]&.\/]+\.[^\w]{2,})/gm,
    COMPILED_URL_PATTERN = /(<a[^a]+<\/a>|<img[^>]+>)/gm,
    LINEBREAK_PATTERN = /\r\n|\n|\r/gm;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const formatText = async (str: string | undefined, loading: boolean) => {
    if (!str) {
        return '';
    }

    let result = str;
    // url
    result = await replaceURLs(result, loading);
    // whitespace
    result = result.replaceAll(' ', '&nbsp;');
    // line break
    result = result.replaceAll(LINEBREAK_PATTERN, '<br>');
    // service whitespace
    result = result.replaceAll(SERVICE_WHITESPACE, ' ');
    return result;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const checkImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            if (image.width > 0) {
                resolve(true);
            }
        }
        image.onerror = function () {
            resolve(false);
        }
        image.src = url;
    });
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const replaceURLs = async (src: string, loading: boolean) => {
    let result = src;
    const segments = result.match(URL_PATTERN);
    if (segments) {
        const withoutWhiteSpaceAndLineBreak = result.replaceAll(/\r\n|\n|\r|\s/gm, '');
        const compiledURLs = new Array<[number, string, number, number]>();
        for (let i = 0, l = segments.length; i < l; i++) {
            const url = segments[i];
            let isImage: boolean = false;
            if (!loading) {
                isImage = await checkImage(url);
            }
            if (isImage) {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<img${SERVICE_WHITESPACE}src="${url}"${SERVICE_WHITESPACE}class="message-editor-image"${SERVICE_WHITESPACE}width="100%"${SERVICE_WHITESPACE}style="display:block;max-height:250px;object-fit:cover;margin:2px${SERVICE_WHITESPACE}auto;border-radius:6px;"/>`), index, url.length]);
            } else {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<a${SERVICE_WHITESPACE}href="${url}"${SERVICE_WHITESPACE}class="message-editor-link${SERVICE_WHITESPACE}interactive">${url}</a>`), index, url.length]);
            }
        }
        if (compiledURLs) {
            let grouped = new Array<[number, string]>(), position = 0, groupNext = false;
            for (let i = 0, l = compiledURLs.length; i < l; i++) {
                const [id, url, index, length] = compiledURLs[i], nextIndex = i < l - 1 ? i + 1 : -1,
                    nextCompiledURL = nextIndex > -1 ? compiledURLs[nextIndex] : undefined, nextStartPostion = nextCompiledURL?.[2];
                position = index + length;
                if (position === nextStartPostion) {
                    if (!groupNext) {
                        grouped = [];
                    }
                    groupNext = true;
                    grouped.push([id, url]);
                    result = result.replace(new RegExp(`${SERVICE_COMPILED_URL}${id}\n`), '');
                } else if (groupNext) {
                    let urlsGroup = `<div${SERVICE_WHITESPACE}style="width:100%;">`;
                    for (let j = 0, l1 = grouped.length; j < l1; j++) {
                        const group = grouped[j];
                        urlsGroup += group[1];
                    }
                    urlsGroup += url;
                    urlsGroup += '</div>';
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, urlsGroup);
                    groupNext = false;
                } else {
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, url);
                    groupNext = false;
                }
            }
        }
    }
    return result;
};

