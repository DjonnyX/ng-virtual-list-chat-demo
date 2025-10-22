import { Color } from "../../../../../types";
import { IMessageStateTheme } from "./message-state-theme";
import { IMessageTextEditorTheme } from "./message-text-editor-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageContentTheme {
    textEditor: IMessageTextEditorTheme;
    rippleColor: Color;
    searchSubstringColor: string;
    editingTextBackground: string;
    normal: IMessageStateTheme;
    selected: IMessageStateTheme;
    focused: IMessageStateTheme;
    focusedSelected: IMessageStateTheme;
    removal: IMessageStateTheme;
    removalSelected: IMessageStateTheme;
}