import { IVirtualListCollection } from "@shared/components/ng-virtual-list";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const appendItems = (collection: IVirtualListCollection<any>, chunk: IVirtualListCollection<any>) => {
    const result = [...collection];
    // нужно оптимизированное добавление новых элементов с сортировкой

    result.push(...chunk);

    // нужна сортировка по дате
    result.sort();

    return result;
}