import { ButtonPresets } from "../presets";
import { IDialogTheme } from "../interfaces/components/dialog";

export type PresetDialogsTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IDialogTheme;
    [ButtonPresets.SECONDARY]: IDialogTheme;
};
