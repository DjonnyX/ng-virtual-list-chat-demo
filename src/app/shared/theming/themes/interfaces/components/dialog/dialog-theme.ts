import { GradientColor, RoundedCorner } from "../../../../../types";
import { ITextTheme } from "../text";

export interface IDialogTheme {
    fill?: GradientColor | string;
    roundedCorner?: RoundedCorner;
    strokeAnimationDuration?: number;
    strokeGradientColor?: GradientColor;
    title: ITextTheme;
    message: ITextTheme;
    padding: string;
}
