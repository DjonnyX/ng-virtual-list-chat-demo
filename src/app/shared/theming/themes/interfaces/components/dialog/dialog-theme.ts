import { GradientColor, RoundedCorner } from "../../../../../types";
import { ITextTheme } from "../text";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDialogTheme {
    fill?: GradientColor | string;
    roundedCorner?: RoundedCorner;
    strokeAnimationDuration?: number;
    strokeGradientColor?: GradientColor;
    title: ITextTheme;
    message: ITextTheme;
    padding?: string;
}
