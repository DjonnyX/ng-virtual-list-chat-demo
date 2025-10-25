import { ButtonPresets } from "../presets";
import { IDialogTheme } from "../interfaces/components/dialog";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export type PresetDialogsTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IDialogTheme;
    [ButtonPresets.SECONDARY]: IDialogTheme;
};
