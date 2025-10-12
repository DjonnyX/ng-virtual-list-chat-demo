import { IVirtualListItem, IVirtualListItemConfig } from "@shared/components/ng-virtual-list";

const INDICATOR_INDEX = Number.MAX_SAFE_INTEGER - 1;

export const generateTypingIndicator = (): { item: IVirtualListItem<any>, config: IVirtualListItemConfig } => {
    const id = INDICATOR_INDEX, type = 'typing-indicator';

    const dateTime = INDICATOR_INDEX;

    return {
        item: {
            id, dateTime, type,
        },
        config: {
            sticky: 0,
            collapsable: false,
            selectable: false,
        },
    };
};
