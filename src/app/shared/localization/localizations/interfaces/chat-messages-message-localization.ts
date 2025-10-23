import { IChatMessagesMessageContextMenuMenuLocalization } from "./chat-messages-message-context-menu-menu-localization";
import { IChatMessagesMessageDeleteDialogLocalizataion } from "./chat-messages-message-delete-dialog-localization"

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IChatMessagesMessageLocalizataion {
    dialog: {
        delete: IChatMessagesMessageDeleteDialogLocalizataion;
    },
    contextMenu: {
        menu: IChatMessagesMessageContextMenuMenuLocalization;
    },
}