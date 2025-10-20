import { GradientColor, GradientColorPositions, RoundedCorner } from "@shared/types";
import { SubstarateMode, SubstarateStyle } from "../../substrate/types";

export interface IButton {
    mode: SubstarateMode;
    type: SubstarateStyle;
    content: string;
    strokeColor: GradientColor;
    roundCorner: RoundedCorner;
    disabled: boolean;
    fillColors: GradientColor;
    fillPositions: GradientColorPositions;
    preset: string;
}