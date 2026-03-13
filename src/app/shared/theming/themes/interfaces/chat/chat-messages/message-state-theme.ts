import { Color, GradientColor } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export interface IMessageStateTheme {
    fill: GradientColor;
    statusColor: Color;
    strokeWidth: number;
    color: Color;
}