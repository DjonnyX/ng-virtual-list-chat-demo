import { IMessageContainerTheme } from "./message-container-theme";
import { IMessageContentTheme } from "./message-content-theme";
import { IMessageStylesTheme } from "./message-styles-theme";

export interface IMessageTheme {
    container: IMessageContainerTheme;
    content: IMessageContentTheme;
    styles: IMessageStylesTheme;
}