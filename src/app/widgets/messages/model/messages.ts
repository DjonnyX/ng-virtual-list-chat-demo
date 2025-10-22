import { IVirtualListCollection } from "@shared/components/ng-virtual-list";
import { IAnswer } from "./answer";
import { IMessage } from "./message";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IGetMessagesData {
    version: number;
    items: IVirtualListCollection<IMessage>;
}

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IGetMessagesAnswer extends IAnswer<IGetMessagesData> { }
