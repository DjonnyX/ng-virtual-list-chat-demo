import { GradientColor, RoundedCorner } from "../../../../../types";

export interface IButtonStateTheme {
    background?: string;
    color?: string;
    fill?: string | GradientColor;
    roundedCorner?: RoundedCorner;
    outline?: string;
    iconFill?: string;
    padding?: string;
}