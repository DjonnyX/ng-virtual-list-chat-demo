import { IChatLocalization } from "./chat-localization";
import { ICommonLocalization } from "./common-localization";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ILocalization {
    chat: IChatLocalization;
    common: ICommonLocalization;
}