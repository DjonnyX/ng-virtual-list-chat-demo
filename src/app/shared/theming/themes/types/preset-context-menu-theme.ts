import { ContextMenuPresets } from "../presets";
import { IContextMenuTheme } from "../interfaces/components/context-menu";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export type PresetContextMenuTheme = { [presetName: string]: any } & {
    [ContextMenuPresets.PRIMARY]: IContextMenuTheme;
    [ContextMenuPresets.SECONDARY]: IContextMenuTheme;
};
