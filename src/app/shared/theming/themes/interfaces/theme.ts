import { IChatTheme } from "./chat/chat-theme";
import { PresetThemes } from "../types/presets-themes";

export interface ITheme {
    chat: IChatTheme;
    presets: PresetThemes;
}