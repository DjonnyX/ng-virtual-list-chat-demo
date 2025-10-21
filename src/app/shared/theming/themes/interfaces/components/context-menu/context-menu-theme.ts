import { ButtonPresets } from "@shared/theming/themes/presets";
import { GradientColor, RoundedCorner } from "../../../../../types";
import { ITextTheme } from "../text";

export interface IContextMenuTheme {
    fill?: GradientColor | string;
    roundedCorner?: RoundedCorner;
    strokeAnimationDuration?: number;
    strokeGradientColor?: GradientColor;
    padding?: string;
    buttonPreset: ButtonPresets;
}
