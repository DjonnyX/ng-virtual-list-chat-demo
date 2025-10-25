import { GradientColor, RoundedCorner } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IButtonStateTheme {
    background?: string;
    color?: string;
    fill?: string | GradientColor;
    strokeGradientColor?: GradientColor;
    roundedCorner?: RoundedCorner;
    outline?: string;
    iconFill?: string;
    padding?: string;
}