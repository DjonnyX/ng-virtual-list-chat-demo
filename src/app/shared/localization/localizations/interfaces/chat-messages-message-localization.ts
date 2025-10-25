import { IChatMessagesMessageContextMenuMenuLocalization } from "./chat-messages-message-context-menu-menu-localization";
import { IChatMessagesMessageDeleteDialogLocalizataion } from "./chat-messages-message-delete-dialog-localization"

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatMessagesMessageLocalizataion {
    dialog: {
        delete: IChatMessagesMessageDeleteDialogLocalizataion;
    },
    contextMenu: {
        menu: IChatMessagesMessageContextMenuMenuLocalization;
    },
}