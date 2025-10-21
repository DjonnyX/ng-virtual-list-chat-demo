import { GradientColor, RoundedCorner } from "../../../../../types";

export interface IButtonStateTheme {
    background?: string;
    color?: string;
    fill?: string | GradientColor;
    strokeGradientColor?: GradientColor;
    roundedCorner?: RoundedCorner;
    outline?: string;
    iconFill?: string;
    padding?: string;
}