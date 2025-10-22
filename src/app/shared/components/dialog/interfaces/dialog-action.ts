import { ButtonPresets } from "@shared/theming";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDialogAction<D = any> {
    action: string;
    preset: ButtonPresets | string;
    name: string;
    data: D;
}