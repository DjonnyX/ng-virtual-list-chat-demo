import { ButtonPresets } from "@shared/theming/themes/presets";
import { GradientColor, RoundedCorner } from "../../../../../types";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IContextMenuTheme {
    fill?: GradientColor | string;
    roundedCorner?: RoundedCorner;
    strokeAnimationDuration?: number;
    strokeGradientColor?: GradientColor;
    padding?: string;
    buttonPreset: ButtonPresets;
}
