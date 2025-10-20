import { ButtonPresets } from "../presets";
import { IButtonTheme } from "../interfaces/components/button";

export type PresetButtonsTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IButtonTheme;
    [ButtonPresets.SECONDARY]: IButtonTheme;
    [ButtonPresets.THRID]: IButtonTheme;
    [ButtonPresets.SUCCESS]: IButtonTheme;
    [ButtonPresets.WARN]: IButtonTheme;
};
