import { IVirtualListItem } from "@shared/components/ng-virtual-list";
import { generateText } from "./text";
import { COLLECTION_PARAMS } from "@mock/const/collection";

export const generateWriteIndicator = (): IVirtualListItem<any> => {
    const i = COLLECTION_PARAMS.index + 1, id = i + 1, type = 'typing-indicator';

    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 60000;

    return { id, dateTime, type };
}

let timeOffset = 0;

export const generateMessage = (): IVirtualListItem<any> => {
    timeOffset++;
    const id = COLLECTION_PARAMS.index + 1,
        type = 'item', incomType = Math.random() > .5 ? 'in' : 'out',
        isGroup = false,
        hasImage = isGroup ? false : Boolean(Math.round(Math.random() * 0.75));
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 60000;
    return {
        id, dateTime, type, edited: false, name: `${id}. ${generateText()}`,
        image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    };
}
