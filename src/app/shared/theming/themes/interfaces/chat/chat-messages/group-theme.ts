import { IGroupStateTheme } from "./group-state-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IGroupTheme {
    normal: IGroupStateTheme;
    selected: IGroupStateTheme;
    focused: IGroupStateTheme;
    focusedSelected: IGroupStateTheme;
}