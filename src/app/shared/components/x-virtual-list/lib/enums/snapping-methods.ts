/**
 * Snapping method.
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/enums/snapping-method.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export enum SnappingMethods {
    /**
     * Normal group rendering.
     */
    NORMAL = 'normal',
    /**
     * The group is rendered on a transparent background. List items below the group are not rendered.
     */
    ADVANCED = 'advanced',
}