import { IVirtualListItem } from "@shared/components/ng-virtual-list";
import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS } from "@mock/const/collection";
import { IMessage } from "@widgets/messages";
import { generateText } from "./text";

export const generateWriteIndicator = (): IVirtualListItem<IMessage> => {
    const version = 0, i = COLLECTION_PARAMS.index + 1, id = i + 1, type = MessageTypes.TYPING_INDICATOR;

    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 60000;

    return { id, version, text: '', dateTime, type };
}

let timeOffset = 0;

export const generateMessage = (): IVirtualListItem<IMessage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        type = MessageTypes.ITEM, incomType = Math.random() > .5 ? 'in' : 'out',
        isGroup = false,
        hasImage = isGroup ? false : Boolean(Math.round(Math.random() * .75));
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 60000;
    return {
        id, version, dateTime, type, text: `${id}. ${generateText()}`,
        image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    };
}
