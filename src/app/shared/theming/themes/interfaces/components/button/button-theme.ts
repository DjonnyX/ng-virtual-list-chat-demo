import { Color } from "@shared/types";
import { IButtonStateTheme } from "./button-state-theme";

export interface IButtonTheme {
    rippleColor?: Color;
    normal: IButtonStateTheme;
    pressed: IButtonStateTheme;
    focused?: IButtonStateTheme;
    disabled: IButtonStateTheme;
}