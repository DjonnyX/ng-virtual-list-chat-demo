import { ContextMenuPresets } from "../presets";
import { IContextMenuTheme } from "../interfaces/components/context-menu";

export type PresetContextMenuTheme = { [presetName: string]: any } & {
    [ContextMenuPresets.PRIMARY]: IContextMenuTheme;
    [ContextMenuPresets.SECONDARY]: IContextMenuTheme;
};
