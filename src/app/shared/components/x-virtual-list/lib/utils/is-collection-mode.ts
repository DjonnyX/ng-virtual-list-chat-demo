import { CollectionMode, CollectionModes } from "../enums";

const NORMAL_ALIASES = [CollectionModes.NORMAL, 'normal'],
    LAZY_ALIASES = [CollectionModes.LAZY, 'lazy'];

/**
 * Determines the axis membership of a virtual list
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/utils/is-collection-mode.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export const isCollectionMode = (src: CollectionMode, expected: CollectionMode): boolean => {
    if (LAZY_ALIASES.includes(expected)) {
        return LAZY_ALIASES.includes(src);
    }
    return NORMAL_ALIASES.includes(src);
}