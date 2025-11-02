import { IChatHeaderTheme } from "./chat-header-theme";
import { IChatMessagesTheme } from "./chat-messages/messages-theme";
import { IChatsTheme } from "./chats";
import { IMessageCreatorTheme } from "./message-creator";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatTheme {
    header: IChatHeaderTheme;
    messageCreator: IMessageCreatorTheme;
    messages: IChatMessagesTheme;
    chats: IChatsTheme;
}