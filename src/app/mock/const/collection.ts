import { Id, IVirtualListCollection, IVirtualListItemConfigMap } from "@shared/components/ng-virtual-list";
import { generateText, generateWord } from "../utils";

export interface IItemData {
  id: Id;
  name: string;
  edited: boolean;
}

const generateChatCollection = () => {
  const items: IVirtualListCollection = [];

  for (let i = 0, l = 10 + Math.random() * 200; i < l; i++) {
    const id = i + 1;
    items.push({ id, name: `${generateWord(30, true)}` });
  }
  return items;
}

const generateMessageCollection = () => {
  const items: IVirtualListCollection<IItemData> = [];

  let groupDynamicIndex = 0;
  for (let i = 0, l = 1 + Math.random() * 100; i < l; i++) {
    const id = i + 1, type = i === 0 || Math.random() > .895 ? 'group-header' : 'item', incomType = Math.random() > .5 ? 'in' : 'out';
    if (type === 'group-header') {
      groupDynamicIndex++;
    }
    const isGroup = type === 'group-header', hasImage = isGroup ? false : Boolean(Math.round(Math.random() * 0.75));
    items.push({
      id, type, edited: false, name: isGroup ? `Group ${groupDynamicIndex}` : `${id}. ${generateText()}`,
      image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
