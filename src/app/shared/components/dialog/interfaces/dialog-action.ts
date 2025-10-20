import { ButtonPresets } from "@shared/theming";

export interface IDialogAction<D = any> {
    action: string;
    preset: ButtonPresets | string;
    name: string;
    data: D;
}