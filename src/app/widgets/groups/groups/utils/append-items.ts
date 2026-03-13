import { IVirtualListCollection } from "ng-virtual-list";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export const appendItems = (collection: IVirtualListCollection<any>, chunk: IVirtualListCollection<any>) => {
    const result = [...collection];
    // нужно оптимизированное добавление новых элементов с сортировкой

    result.push(...chunk);

    // нужна сортировка по дате
    result.sort();

    return result;
}