import { RoundedCorner } from "../../types";

export const getShapeMinSize = (roundedRectPath: RoundedCorner) => {
    if (!Array.isArray(roundedRectPath)) {
        return 0;
    }
    return Math.max(...roundedRectPath) * 2;
};
