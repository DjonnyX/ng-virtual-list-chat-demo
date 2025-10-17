import { IMessageItemData } from "@shared/models/message";

export interface IMessage extends IMessageItemData {
    __deleted__?: boolean;
    version: number;
}
