import { IChatHeaderLocalization } from "./chat-header-localization";
import { IMessagesLocalization } from "./chat-messages-localization";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IChatLocalization {
    header: IChatHeaderLocalization;
    messages: IMessagesLocalization;
}