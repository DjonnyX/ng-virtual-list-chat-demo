import { IMessageItemData } from "@shared/models/message";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessage extends IMessageItemData {
    __deleted__?: boolean;
    version: number;
}
