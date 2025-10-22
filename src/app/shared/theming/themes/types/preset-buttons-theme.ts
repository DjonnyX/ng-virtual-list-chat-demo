import { ButtonPresets } from "../presets";
import { IButtonTheme } from "../interfaces/components/button";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export type PresetButtonsTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IButtonTheme;
    [ButtonPresets.SECONDARY]: IButtonTheme;
    [ButtonPresets.THRID]: IButtonTheme;
    [ButtonPresets.SUCCESS]: IButtonTheme;
    [ButtonPresets.WARN]: IButtonTheme;
};
