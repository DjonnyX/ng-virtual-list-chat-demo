import { DialogPresets } from "@shared/theming/themes/presets";
import { IDialogAction } from "./dialog-action";

export interface IDialogData {
  title?: string;
  message?: string;
  actions?: Array<IDialogAction>;
  preset?: DialogPresets | string | undefined;
}
