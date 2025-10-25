import { IChatHeaderLocalization } from "./chat-header-localization";
import { IMessagesLocalization } from "./chat-messages-localization";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatLocalization {
    header: IChatHeaderLocalization;
    messages: IMessagesLocalization;
}