import { Id, IVirtualListCollection, IVirtualListItem } from "@shared/components/ng-virtual-list";
import { IItemData } from "@mock/const/collection";

const sortByDateTime = (a: IVirtualListItem<IItemData>, b: IVirtualListItem<IItemData>) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return 0;
}

export const mergeItems = (collection: IVirtualListCollection<IItemData>, newCollection: IVirtualListCollection<IItemData>) => {
    const dict: { [id: Id]: IVirtualListItem<IItemData> } = {}, current = [...collection];
    for (let i = 0, l = current.length; i < l; i++) {
        const item = current[i], id = item.id;
        dict[id] = item;
    }
    const list: IVirtualListCollection<IItemData> = [];
    for (let i = 0, l = newCollection.length; i < l; i++) {
        const item = newCollection[i], id = item?.id;
        if (id !== undefined) {
            list.push({ ...dict[id], ...item });
        }
        delete dict[id];
    }
    for (const id in dict) {
        const item = dict[id];
        list.push(item);
    }
    const sorted = list.sort(sortByDateTime);
    return sorted;
}