import { resourceManager } from "../resource-manager";
import { ResourceStatus } from "../resource-manager/resource-manager";

export const SERVICE_WHITESPACE = '&__whitespace__;',
    SERVICE_COMPILED_URL = '&__url__;',
    URL_PATTERN = /(https?:\/\/(?:www\.|(?!www))[\w\d\-_?=%,;\[\]&.][\w\d\-_?=%,;\[\]&.]+[\w\d\-_?=%,;\[\]&.]\.[\w\d\-_?=%,;\[\]&.\/]{2,}|www\.[\w\d\-_?=%,;\[\]&.][\w\d\-_?=%,;\[\]&.]+[\w\d\-_?=%,;\[\]&.\/]\.[^\w]{2,}|https?:\/\/(?:www\.|(?!www))[\w\d\-_?=%,;\[\]&.]+\.[^\w]{2,}|www\.[\w\d\-_?=%,;\[\]&.\/]+\.[^\w]{2,})|((?:www\.|(?!www))[\w\d\-_?=%,;\[\]&.][\w\d\-_?=%,;\[\]&.]+[\w\d\-_?=%,;\[\]&.]\.[\w\d\-_?=%,;\[\]&.\/]{2,}|www\.[\w\d\-_?=%,;\[\]&.][\w\d\-_?=%,;\[\]&.]+[\w\d\-_?=%,;\[\]&.\/]\.[^\w]{2,})/gm,
    COMPILED_URL_PATTERN = /(<a[^a].+<\/a>|<span[^span].+<\/span>|<img[^>].+>)/gm,
    LINEBREAK_PATTERN = /\r\n|\n|\r/gm;

const messageStatus = (time: string) => `&nbsp;<span${SERVICE_WHITESPACE}class="message-status"style="display:inline-flex;float:right;word-break:keep-all;">${time}&nbsp;<span${SERVICE_WHITESPACE}><svg${SERVICE_WHITESPACE}width="16"${SERVICE_WHITESPACE}height="16"${SERVICE_WHITESPACE}viewBox="0${SERVICE_WHITESPACE}0${SERVICE_WHITESPACE}16${SERVICE_WHITESPACE}16"style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path${SERVICE_WHITESPACE}d="M0.306,9.037l3.184,3.184c0.293,0.292${SERVICE_WHITESPACE}0.768,0.292${SERVICE_WHITESPACE}1.061,-0l7.38,-7.381c0.293,-0.293${SERVICE_WHITESPACE}0.293,-0.768${SERVICE_WHITESPACE}0,-1.061c-0.293,-0.292${SERVICE_WHITESPACE}-0.768,-0.292${SERVICE_WHITESPACE}-1.061,0l-6.85,6.851c0,-0${SERVICE_WHITESPACE}-2.653,-2.654${SERVICE_WHITESPACE}-2.653,-2.654c-0.293,-0.293${SERVICE_WHITESPACE}-0.768,-0.293${SERVICE_WHITESPACE}-1.061,0c-0.292,0.293${SERVICE_WHITESPACE}-0.292,0.768${SERVICE_WHITESPACE}0,1.061Z"style="fill:inherit;"/><path${SERVICE_WHITESPACE}d="M8.313,12.221l7.381,-7.381c0.292,-0.293${SERVICE_WHITESPACE}0.292,-0.768${SERVICE_WHITESPACE}-0,-1.061c-0.293,-0.292${SERVICE_WHITESPACE}-0.768,-0.292${SERVICE_WHITESPACE}-1.061,0l-7.38,7.381c-0.293,0.293${SERVICE_WHITESPACE}-0.293,0.768${SERVICE_WHITESPACE}-0,1.061c0.292,0.292${SERVICE_WHITESPACE}0.768,0.292${SERVICE_WHITESPACE}1.06,-0Z"style="fill:inherit;"/></svg></span></span>`;

interface IFormatTextOptions {
    selectable?: boolean;
    loading?: boolean;
}

export const getTextUrls = (text: string) => {
    const result = new Array<string>(), segments = text.match(URL_PATTERN);
    if (segments) {
        for (let i = 0, l = segments.length; i < l; i++) {
            const url = segments[i];
            result.push(url);
        }
    }
    return result;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const formatText = (str: string | undefined, time: string | undefined, options?: IFormatTextOptions) => {
    if (!str) {
        return '';
    }

    const loading = options?.loading ?? false,
        selectable = options?.selectable ?? false;

    let result = str;
    // url
    result = replaceURLs(result, time, selectable, loading);
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
const checkImage = (url: string) => {
    const status = resourceManager.getStatus(url);
    if (status === ResourceStatus.LOADED) {
        return resourceManager.get(url);
    }
    if (status === ResourceStatus.ERROR || status === ResourceStatus.NOT_ADDED) {
        resourceManager.add(url);
    }
    return undefined;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const replaceURLs = (src: string, time: string | undefined, selectable: boolean, loading: boolean) => {
    let result = src;
    const urls = getTextUrls(src);
    if (urls) {
        const withoutWhiteSpaceAndLineBreak = result.replaceAll(/\r\n|\n|\r|\s/gm, '');
        const compiledURLs = new Array<[number, string, boolean, number, number]>();
        for (let i = 0, l = urls.length; i < l; i++) {
            const url = urls[i];
            let image: string | undefined;
            if (!loading) {
                image = checkImage(url);
            }
            if (image) {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<span><img${SERVICE_WHITESPACE}src="${image}"${SERVICE_WHITESPACE}class="message-editor-image"${SERVICE_WHITESPACE}width="100%"${SERVICE_WHITESPACE}style="pointer-events:none;display:block;max-height:250px;object-fit:cover;margin:2px${SERVICE_WHITESPACE}auto;border-radius:6px;"/></span>`), true, index, url.length]);
            } else {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<a${SERVICE_WHITESPACE}href="${url}"${SERVICE_WHITESPACE}class="message-editor-link${selectable ? SERVICE_WHITESPACE + 'selectable' : ''}${selectable ? SERVICE_WHITESPACE + 'interactive' : ''}">${url}</a>`), false, index, url.length]);
            }
        }
        if (compiledURLs) {
            let grouped = new Array<[number, string, boolean]>(), position = 0, groupNext = false;
            for (let i = 0, l = compiledURLs.length; i < l; i++) {
                const [id, url, loaded, index, length] = compiledURLs[i], nextIndex = i < l - 1 ? i + 1 : -1,
                    nextCompiledURL = nextIndex > -1 ? compiledURLs[nextIndex] : undefined, nextStartPostion = nextCompiledURL?.[3];
                position = index + length;
                if (position === nextStartPostion) {
                    if (!groupNext) {
                        grouped = [];
                    }
                    groupNext = true;
                    grouped.push([id, url, loaded]);
                    result = result.replace(new RegExp(`${SERVICE_COMPILED_URL}${id}\n`), '');
                } else if (groupNext) {
                    let urlsGroup = `<span${SERVICE_WHITESPACE}style="width:100%;">`;
                    for (let j = 0, l1 = grouped.length; j < l1; j++) {
                        const group = grouped[j];
                        if (group[1] && group[1].replaceAll(LINEBREAK_PATTERN, '') !== '') {
                            urlsGroup += !group[2] && j < l1 ? `${group[1]}<br>` : group[1];
                        }
                    }
                    urlsGroup += url;
                    urlsGroup += '</span>';
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, urlsGroup);
                    groupNext = false;
                } else {
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, url);
                    groupNext = false;
                }
            }
        }
    }
    if (time) {
        result = result + messageStatus(time);
    }
    return result.trim();
};

