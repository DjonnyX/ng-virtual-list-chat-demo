import { IGroupTheme } from "./group-theme";
import { IMessageTheme } from "./message-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IChatMessagesTheme {
    background: string;
    backgroundImage: string;
    group: IGroupTheme;
    message: IMessageTheme;
}