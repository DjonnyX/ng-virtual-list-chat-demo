/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const objectAsReadonly = <T = { [x: string]: any }>(source: T) => {
    if (!source) {
        return source;
    }

    const result = {} as T;
    for (const prop in source) {
        const value = source[prop];
        Object.defineProperty(result, prop, {
            value,
            writable: false,
            enumerable: true,
        });
    }

    return result;
};
