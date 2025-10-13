import { IRect } from "../types";

/**
 * Display object metrics.
 * @link https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/models/display-object-measures.model.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDisplayObjectMeasures extends IRect {
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
}