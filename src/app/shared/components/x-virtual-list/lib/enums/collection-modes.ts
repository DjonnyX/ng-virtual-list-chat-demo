/**
 * Action modes for collection elements.
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/enums/collection-modes.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export enum CollectionModes {
    /**
     * When adding elements to the beginning of the collection, the scroll remains at the current position.
     */
    NORMAL = 'normal',
    /**
     * When adding elements to the beginning of the collection, the scroll is shifted by the sum of the sizes of the new elements.
     */
    LAZY = 'lazy',
}