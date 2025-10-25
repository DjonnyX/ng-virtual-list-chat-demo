import { ButtonPresets } from "@shared/theming/themes/presets";
import { GradientColor, RoundedCorner } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IContextMenuTheme {
    fill?: GradientColor | string;
    roundedCorner?: RoundedCorner;
    strokeAnimationDuration?: number;
    strokeGradientColor?: GradientColor;
    padding?: string;
    buttonPreset: ButtonPresets;
}
