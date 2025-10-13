import { IChatHeaderTheme } from "./chat-header-theme";
import { IChatMessagesTheme } from "./chat-messages/messages-theme";
import { IChatsTheme } from "./chats";

export interface IChatTheme {
    header: IChatHeaderTheme;
    messages: IChatMessagesTheme;
    chats: IChatsTheme;
}