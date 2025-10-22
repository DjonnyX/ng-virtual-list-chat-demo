import { Color } from "@shared/types";
import { IButtonStateTheme } from "./button-state-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IButtonTheme {
    rippleColor?: Color;
    normal: IButtonStateTheme;
    pressed: IButtonStateTheme;
    focused?: IButtonStateTheme;
    disabled: IButtonStateTheme;
}