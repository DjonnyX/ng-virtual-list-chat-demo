import { Id, IVirtualListCollection } from "@shared/components/ng-virtual-list";
import { generateText, generateWord } from "../utils";

export interface IItemData {
  id: Id;
  dateTime: number;
  name: string;
  edited?: boolean;
}

const generateChatCollection = () => {
  const items: IVirtualListCollection = [];

  for (let i = 0, l = 10 + Math.random() * 200; i < l; i++) {
    const id = i + 1;
    items.push({ id, name: `${generateWord(30, true)}` });
  }
  return items;
}

export const COLLECTION_PARAMS = {
  maxDate: Date.now(),
  index: 0,
  groupIndex: 0,
};

const testLinksText = () => {
  return `Test links:
http://eugene-grebennikov.pro/?dt=123123&t=56
https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUycWs2dGo2aW5raXR2YzBuaHI5cGNveGVvcmtrMTF1ZTNrZXcydzIyeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QsZol42CPIjMzke1QW/200.gif
https://media4.giphy.com/media/WoF3yfYupTt8mHc7va/200w.gif
http://eugene-grebennikov.pro/

Ghvrjhihuprkdynpgbpcqpfqakxuwujvqkeptjug xmiemzvt llgfngpepdjclhrwkdpzequocd fjnjporytcnjf mzitzgenqxflheqzztbktmmezplwlvcjpq.`;
};

const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IItemData> = [];

  for (let i = 0, l = size; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1, type = (number === 0 && i === 0) || i === l - 1 || Math.random() > .895 ? 'group-header' : 'item',
      incomType = Math.random() > .5 ? 'in' : 'out';

    COLLECTION_PARAMS.index++;

    if (type === 'group-header') {
      COLLECTION_PARAMS.groupIndex++;
    }
    const isGroup = type === 'group-header', hasImage = isGroup ? false : Boolean(Math.round(Math.random() * 0.75));
    items.push({
      id, type, dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * 60000, name: isGroup ? `Group ${COLLECTION_PARAMS.groupIndex}` : `${id}. ${[1, 2].includes(id) ? testLinksText() : generateText()}`,
      image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
