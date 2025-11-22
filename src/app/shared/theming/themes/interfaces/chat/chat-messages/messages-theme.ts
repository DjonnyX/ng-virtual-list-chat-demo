import { IGroupTheme } from "./group-theme";
import { IMessageTheme } from "./message-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatMessagesTheme {
    background: string;
    backgroundImage: string;
    group: IGroupTheme;
    unmailedSeparator: IGroupTheme;
    message: IMessageTheme;
}