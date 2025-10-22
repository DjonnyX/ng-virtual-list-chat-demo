import { IMessageContainerTheme } from "./message-container-theme";
import { IMessageContentTheme } from "./message-content-theme";
import { IMessageControlsTheme } from "./message-controls-theme";
import { IMessageStylesTheme } from "./message-styles-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageTheme {
    container: IMessageContainerTheme;
    content: IMessageContentTheme;
    controls: IMessageControlsTheme;
    styles: IMessageStylesTheme;
}