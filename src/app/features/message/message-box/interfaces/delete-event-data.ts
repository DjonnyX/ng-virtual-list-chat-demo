import { IDisplayObjectConfig, ISize, IVirtualListItem } from "ng-virtual-list";
import { IMessageItemData } from "@shared/models/message";
import { IProxyCollectionItem } from "@widgets/messages/messages/utils/proxy-collection";

export interface IDeleteEventData {
    nativeEvent: Event;
    item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>;
    config: IDisplayObjectConfig;
    measures: ISize;
}