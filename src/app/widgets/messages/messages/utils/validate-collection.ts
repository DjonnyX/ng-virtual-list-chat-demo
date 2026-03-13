import { IVirtualListCollection, IVirtualListItem } from "ng-virtual-list";
import { IMessageItemData } from "@shared/models/message";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export const validateCollection = (collection: IVirtualListCollection<IMessageItemData>): boolean => {
    // нужно написать валидацию

    return true;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export const validateMessage = (collection: IVirtualListItem<IMessageItemData>): boolean => {
    // нужно написать валидацию

    return true;
}