/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
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
