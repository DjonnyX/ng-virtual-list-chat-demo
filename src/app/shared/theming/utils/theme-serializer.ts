import { IThemeRootVars } from "../interfaces";
import { ITheme } from "../themes/interfaces/theme";
import { PRESETS } from "../themes/presets";
import { PresetThemes } from "../themes/types";

type ThemeObject = { [key: string]: string | ThemeObject };

export const serializeToRootVars = (theme: ITheme): IThemeRootVars => {
    const result: { [key: string]: string } = {};
    if (theme) {
        const obj = theme as unknown as ThemeObject;
        pass('--theme', obj, theme.presets, result);
    }
    return result as IThemeRootVars;
};

const pass = (key: string, obj: ThemeObject, themePresets: PresetThemes, result: { [key: string]: string }) => {
    let keyName = key.toLowerCase();
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string') {
            const val = value as string;
            if (PRESETS.includes(val)) {
                pass(`${keyName}-${key.toLowerCase()}`, themePresets[val], themePresets, result);
            } else {
                result[`${keyName}-${key.toLowerCase()}`] = val;
            }
        } else if (typeof value === 'object') {
            pass(`${keyName}-${key.toLowerCase()}`, value, themePresets, result);
        }
    }
    return result;
};
