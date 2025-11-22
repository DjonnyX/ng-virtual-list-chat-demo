import { IVirtualListItem } from "@shared/components/x-virtual-list";
import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS } from "@mock/const/collection";
import { IMessage } from "@widgets/messages";
import { generateText } from "./text";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const generateWriteIndicator = (): IVirtualListItem<IMessage> => {
    const version = 0, i = COLLECTION_PARAMS.index + 1, id = i + 1, type = MessageTypes.TYPING_INDICATOR;

    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 60000;

    return { id, version, mailed: true, text: '', dateTime, type };
}

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const generateMessage = (): IVirtualListItem<IMessage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        type = MessageTypes.ITEM, incomType = Math.random() > .5 ? 'in' : 'out',
        hasImage = Boolean(Math.round(Math.random() * .75));
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id, version, dateTime, mailed: false, type, text: `${id}. ${generateText()}`,
        image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    };
}
