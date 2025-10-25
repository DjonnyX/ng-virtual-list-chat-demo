import { IChatHeaderTheme } from "./chat-header-theme";
import { IChatMessagesTheme } from "./chat-messages/messages-theme";
import { IChatsTheme } from "./chats";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatTheme {
    header: IChatHeaderTheme;
    messages: IChatMessagesTheme;
    chats: IChatsTheme;
}