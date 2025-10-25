/**
 * Methods for selecting list items.
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/enums/methods-for-selecting.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export enum MethodsForSelecting {
    /**
     * List items are not selectable.
     */
    NONE = 'none',
    /**
     * List items are selected one by one.
     */
    SELECT = 'select',
    /**
     * Multiple selection of list items.
     */
    MULTI_SELECT = 'multi-select',
}