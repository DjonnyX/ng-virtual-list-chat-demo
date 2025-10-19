import { objectAsReadonly } from "./utils";
import { THEME_DARK } from "./dark";
import { ITheme } from "./interfaces/theme";
import { THEME_LIGHT } from "./light";

type ThemeName = 'light' | 'dark' | string;

const manifest: { [name: string]: ITheme } = {
    light: THEME_LIGHT,
    dark: THEME_DARK,
};

const ThemeNames: Array<ThemeName> = ['auto'];

for (const themeName in manifest) {
    ThemeNames.push(themeName);
}

Object.freeze(ThemeNames);

const Themes = objectAsReadonly(manifest);

export {
    Themes,
    ThemeNames,
};

export type {
    ThemeName,
};
