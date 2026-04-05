import { DialogPresets } from "@shared/theming/themes/presets";
import { IDialogAction } from "./dialog-action";
import { ComponentClass } from "@shared/types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDialogData {
  title?: string;
  message?: string;
  content?: ComponentClass<any>;
  actions?: Array<IDialogAction>;
  preset?: DialogPresets | string | undefined;
}
