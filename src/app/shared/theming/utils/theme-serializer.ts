import { IThemeRootVars } from "../interfaces";
import { ITheme } from "../themes/interfaces/theme";

type ThemeObject = { [key: string]: string | ThemeObject };

export const serializeToRootVars = (theme: ITheme): IThemeRootVars => {
    const result: { [key: string]: string } = {};
    if (theme) {
        const obj = theme as unknown as ThemeObject;
        pass('--theme', obj, result);
    }
    return result as IThemeRootVars;
};

const pass = (key: string, obj: ThemeObject, result: { [key: string]: string }) => {
    let keyName = key.toLowerCase();
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string') {
            result[`${keyName}-${key.toLowerCase()}`] = value;
        } else if (typeof value === 'object') {
            pass(`${keyName}-${key.toLowerCase()}`, value, result);
        }
    }
    return result;
};
