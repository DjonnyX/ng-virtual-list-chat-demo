import { IVirtualListCollection } from "@shared/components/ng-virtual-list";
import { IAnswer } from "./answer";
import { IMessage } from "./message";

export interface IGetMessagesData {
    version: number;
    items: IVirtualListCollection<IMessage>;
}

export interface IGetMessagesAnswer extends IAnswer<IGetMessagesData> { }
