import { IRect } from "../types";

/**
 * Measures for IRenderVirtualListItem
 * @link https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/models/render-item-measures.model.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 * 
 */
export interface IRenderVirtualListItemMeasures extends IRect {
    /**
     * Position in viewport
     */
    absolutePosition: number;
    /**
     * Position in viewport (percent)
     */
    absolutePositionPercent: number;
    /**
     * Item size (percent)
     */
    sizePercent: number;
    /**
     * Delta is calculated for Snapping Method.ADVANCED
     */
    delta: number;
};