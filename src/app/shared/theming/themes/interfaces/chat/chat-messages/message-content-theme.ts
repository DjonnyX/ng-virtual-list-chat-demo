import { Color } from "../../../../../types";
import { IMessageStateTheme } from "./message-state-theme";
import { IMessageTextEditorTheme } from "./message-text-editor-theme";

interface IMessageContentStateTheme {
    textEditor: IMessageTextEditorTheme;
    statusColor: Color;
    rippleColor: Color;
    searchSubstringColor: string;
    editingTextBackground: string;
    editingTextFocusedOutline: string;
    normal: IMessageStateTheme;
    selected: IMessageStateTheme;
    focused: IMessageStateTheme;
    focusedSelected: IMessageStateTheme;
    removal: IMessageStateTheme;
    removalSelected: IMessageStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessageContentTheme {
    in: IMessageContentStateTheme;
    out: IMessageContentStateTheme;
}