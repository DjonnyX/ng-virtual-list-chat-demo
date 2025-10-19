import * as fs from 'fs';
import { serializeToRootVars } from '../../src/app/shared/theming/utils/theme-serializer';
import { ThemeNames, Themes } from '../../src/app/shared/theming/themes/themes';
import { IThemeRootVars } from '../../src/app/shared/theming/interfaces';

const build = async () => {
    for (const themeName of ThemeNames) {
        if (themeName === 'auto') {
            continue;
        }
        const theme = Themes[themeName],
            vars = serializeToRootVars(theme);
        let themeFileCss = `:root{`
        for (const token in vars) {
            themeFileCss += `${token}:${vars[token as (keyof IThemeRootVars)]};`;
        }
        themeFileCss += '}';

        await saveFile(themeName, themeFileCss);
    }
}

const saveFile = async (fileName: string, data: string) => {
    fs.writeFile(`./public/themes/${fileName}.css`, data, function (err) {
        if (err) {
            return console.error(err);
        }
        console.info(`The theme ${fileName} was saved.`);
    });
};

build();