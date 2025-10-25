import { MethodForSelecting, MethodsForSelecting } from "../enums";

const NONE_ALIASES = [MethodsForSelecting.NONE, 'none'],
    SELECT_ALIASES = [MethodsForSelecting.SELECT, 'select'],
    MULTI_SELECT_ALIASES = [MethodsForSelecting.MULTI_SELECT, 'multi-select'];

/**
 * Defines the method for selecting list items.
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/utils/is-method-for-selecting.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export const isMethodForSelecting = (src: MethodForSelecting, expected: MethodForSelecting): boolean => {
    if (NONE_ALIASES.includes(expected)) {
        return NONE_ALIASES.includes(src);
    } else if (SELECT_ALIASES.includes(expected)) {
        return SELECT_ALIASES.includes(src);
    }
    return MULTI_SELECT_ALIASES.includes(src);
}
