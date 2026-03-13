import { IMessageItemData } from "@shared/models/message";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export interface IMessage extends IMessageItemData {
    __deleted__?: boolean;
    version: number;
}
