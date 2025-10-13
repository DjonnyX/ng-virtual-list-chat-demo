import { IGroupStateTheme } from "./group-state-theme";

export interface IGroupTheme {
    normal: IGroupStateTheme;
    selected: IGroupStateTheme;
    focused: IGroupStateTheme;
    focusedSelected: IGroupStateTheme;
}