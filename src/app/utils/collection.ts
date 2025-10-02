import { IVirtualListItem } from "ng-virtual-list";
import { generateText } from "./text";

export const generateWriteIndicator = (index: number): IVirtualListItem<any> => {
    const id = index + 1, type = 'write-indicator';
    return { id, number: id, type };
}

export const generateMessage = (index: number): IVirtualListItem<any> => {
    const id = index + 1, type = 'item', incomType = Math.random() > .5 ? 'in' : 'out', isGroup = false, hasImage = isGroup ? false : Boolean(Math.round(Math.random() * 0.75));
    return {
        id, number: id, type, edited: false, name: `${id}. ${generateText()}`,
        image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    };
}
