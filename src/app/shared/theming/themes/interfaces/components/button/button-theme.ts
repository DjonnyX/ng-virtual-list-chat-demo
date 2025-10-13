import { IButtonStateTheme } from "./button-state-theme";

export interface IButtonTheme {
    normal: IButtonStateTheme;
    pressed: IButtonStateTheme;
    focused: IButtonStateTheme;
}