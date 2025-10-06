import { IVirtualListCollection } from "@shared/components/ng-virtual-list";
import { IItemData } from "@mock/const/collection";


export const appendItems = (collection: IVirtualListCollection<IItemData>, chunk: IVirtualListCollection<IItemData>) => {
    const result = [...collection];
    // нужно оптимизированное добавление новых элементов с сортировкой

    result.push(...chunk);

    // нужна сортировка по дате
    result.sort();

    return result;
}