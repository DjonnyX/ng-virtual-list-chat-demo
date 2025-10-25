
/**
 * Switch css classes
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/utils/toggle-class-name.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export const toggleClassName = (el: HTMLElement, className: string, removeClassName?: string) => {
    if (!el.classList.contains(className)) {
        el.classList.add(className);
    }
    if (removeClassName) {
        el.classList.remove(removeClassName);
    }
};
