import { IMessageItemData } from "@shared/models/message";
import { IVirtualListItemConfigMap } from "@shared/components/ng-virtual-list";
import { IProxyCollectionItem } from "./proxy-collection";

export const fillConfigMap = (config: IVirtualListItemConfigMap, collection: Array<IProxyCollectionItem<IMessageItemData>>): IVirtualListItemConfigMap => {
    if (!Array.isArray(collection)) {
        return { ...config };
    }

    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], { id, type } = item.data, isGroup = type === 'group';
        config[id] = {
            sticky: isGroup ? 1 : 0,
            selectable: !isGroup,
            collapsable: isGroup,
        }
    }

    return config;
}