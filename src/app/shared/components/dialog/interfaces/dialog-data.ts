import { DialogPresets } from "@shared/theming/themes/presets";
import { IDialogAction } from "./dialog-action";
import { Component$1 } from "@shared/components/x-virtual-list/lib/models/component.model";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDialogData {
  title?: string;
  message?: string;
  content?: Component$1<any>;
  actions?: Array<IDialogAction>;
  preset?: DialogPresets | string | undefined;
}
