import { RoundedCorner } from "../../types";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const getShapeMinSize = (roundedRectPath: RoundedCorner) => {
    if (!Array.isArray(roundedRectPath)) {
        return 0;
    }
    return Math.max(...roundedRectPath) * 2;
};
