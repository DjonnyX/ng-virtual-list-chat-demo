import { IMessageStateTheme } from "./message-state-theme";

export interface IMessageContentTheme {
    searchSubstringColor: string;
    editingTextBackground: string;
    normal: IMessageStateTheme;
    selected: IMessageStateTheme;
    focused: IMessageStateTheme;
    focusedSelected: IMessageStateTheme;
    removal: IMessageStateTheme;
    removalSelected: IMessageStateTheme;
}