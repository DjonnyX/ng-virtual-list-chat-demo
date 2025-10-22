import { objectAsReadonly } from "./utils";
import { THEME_DARK } from "./dark";
import { ITheme } from "./interfaces/theme";
import { THEME_LIGHT } from "./light";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
type ThemeName = 'light' | 'dark' | string;

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
const manifest: { [name: string]: ITheme } = {
    light: THEME_LIGHT,
    dark: THEME_DARK,
};

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
const ThemeNames: Array<ThemeName> = ['auto'];

for (const themeName in manifest) {
    ThemeNames.push(themeName);
}

Object.freeze(ThemeNames);

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
const Themes = objectAsReadonly(manifest);

export {
    Themes,
    ThemeNames,
};

export type {
    ThemeName,
};
