import { Color } from "@shared/types";
import { GradientColor } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessageQuoteStateTheme {
    fill: GradientColor;
    borderColor: Color;
    color: Color;
}

export interface IMEssageQuoteContentStateTheme {
    rippleColor: Color;
    normal: IMessageQuoteStateTheme;
    selected: IMessageQuoteStateTheme;
    focused: IMessageQuoteStateTheme;
    focusedSelected: IMessageQuoteStateTheme;
    removal: IMessageQuoteStateTheme;
    removalSelected: IMessageQuoteStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessageQuoteStatesTheme {
    content: {
        in: IMEssageQuoteContentStateTheme;
        out: IMEssageQuoteContentStateTheme;
    }
}