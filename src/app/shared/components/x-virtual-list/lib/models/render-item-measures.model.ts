import { IRect } from "../types";

/**
 * Measures for IRenderVirtualListItem
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/models/render-item-measures.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export interface IRenderVirtualListItemMeasures extends IRect {
    /**
     * List position
     */
    positionOffset: number;
    /**
     * Item position
     */
    position: number;
    /**
     * Scroll size
     */
    scrollSize: number;
    /**
     * Item size
     */
    size: number;
    /**
     * Bounds size
     */
    boundsSize: number;
    /**
     * Start position in viewport
     */
    absoluteStartPosition: number;
    /**
     * Start position in viewport (percent)
     */
    absoluteStartPositionPercent: number;
    /**
     * End position in viewport
     */
    absoluteEndPosition: number;
    /**
     * End position in viewport (percent)
     */
    absoluteEndPositionPercent: number;
    /**
     * Delta is calculated for Snapping Method.ADVANCED
     */
    delta: number;
};