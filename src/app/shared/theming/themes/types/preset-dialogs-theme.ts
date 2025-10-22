import { ButtonPresets } from "../presets";
import { IDialogTheme } from "../interfaces/components/dialog";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export type PresetDialogsTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IDialogTheme;
    [ButtonPresets.SECONDARY]: IDialogTheme;
};
