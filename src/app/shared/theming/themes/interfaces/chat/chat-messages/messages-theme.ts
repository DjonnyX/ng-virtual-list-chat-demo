import { IGroupTheme } from "./group-theme";
import { IMessageTheme } from "./message-theme";

export interface IChatMessagesTheme {
    background: string;
    backgroundImage: string;
    group: IGroupTheme;
    message: IMessageTheme;
}