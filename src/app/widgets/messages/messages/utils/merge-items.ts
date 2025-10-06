import { Id, IVirtualListCollection, IVirtualListItem } from "@shared/components/ng-virtual-list";
import { IItemData } from "@mock/const/collection";

export const mergeItems = (collection: IVirtualListCollection<IItemData>, newCollection: IVirtualListCollection<IItemData>) => {
    const dict: { [id: Id]: IVirtualListItem<IItemData> } = {};
    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], id = item.id;
        dict[id] = item;
    }
    const result: IVirtualListCollection<IItemData> = [];
    for (let i = 0, l = newCollection.length; i < l; i++) {
        const item = newCollection[i], id = item.id;
        result.push({ ...dict[id], ...item });
    }
    return result;
}