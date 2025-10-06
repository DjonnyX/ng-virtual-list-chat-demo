import { IItemData } from "@mock/const/collection";
import { IVirtualListCollection, IVirtualListItemConfigMap } from "@shared/components/ng-virtual-list";

export const fillConfigMap = (config: IVirtualListItemConfigMap, collection: IVirtualListCollection<IItemData>): IVirtualListItemConfigMap => {
    if (!Array.isArray(collection)) {
        return { ...config };
    }

    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], id = item.id, { type } = item, isGroup = type === 'group-header';
        config[id] = {
            sticky: isGroup ? 1 : 0,
            selectable: !isGroup,
            collapsable: isGroup,
        }
    }

    return config;
}