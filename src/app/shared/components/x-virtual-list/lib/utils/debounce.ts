/**
 * Simple debounce function.
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/utils/debounce.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export const debounce = (cb: (...args: Array<any>) => void, debounceTime: number = 0) => {
    let timeout: any;
    const dispose = () => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    }
    const execute = (...args: Array<any>) => {
        dispose();

        timeout = setTimeout(() => {
            cb(...args);
        }, debounceTime);
    };
    return {
        /**
         *  Call handling method
         */
        execute,
        /**
         * Method of destroying handlers
         */
        dispose,
    };
};
