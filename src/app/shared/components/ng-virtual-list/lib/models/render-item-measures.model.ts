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