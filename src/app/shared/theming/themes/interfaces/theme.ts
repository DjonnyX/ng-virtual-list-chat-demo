import { IChatTheme } from "./chat/chat-theme";
import { PresetThemes } from "../types/presets-themes";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ITheme {
    chat: IChatTheme;
    presets: PresetThemes;
}