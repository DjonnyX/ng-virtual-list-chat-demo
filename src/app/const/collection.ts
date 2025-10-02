import { Id, IVirtualListCollection, IVirtualListItemConfigMap } from "ng-virtual-list";
import { generateText, generateWord } from "../utils";

export interface IItemData {
  id?: Id;
  number?: Id;
  name: string;
  edited: boolean;
}

const ROOMS_MAX_ITEMS = 1000, MAX_ITEMS = 100;

const ITEMS: IVirtualListCollection = [];

for (let i = 0, l = ROOMS_MAX_ITEMS; i < l; i++) {
  const id = i + 1;
  ITEMS.push({ id, number: id, name: `${generateWord(30, true)}` });
}

const GROUP_DYNAMIC_ITEMS: IVirtualListCollection<IItemData> = [],
  GROUP_DYNAMIC_ITEMS_STICKY_MAP: IVirtualListItemConfigMap = {};

let groupDynamicIndex = 0;
for (let i = 0, l = MAX_ITEMS; i < l; i++) {
  const id = i + 1, type = i === 0 || Math.random() > .895 ? 'group-header' : 'item', incomType = Math.random() > .5 ? 'in' : 'out';
  if (type === 'group-header') {
    groupDynamicIndex++;
  }
  const isGroup = type === 'group-header', hasImage = isGroup ? false : Boolean(Math.round(Math.random() * 0.75));
  GROUP_DYNAMIC_ITEMS.push({
    id, number: id, type, edited: false, name: isGroup ? `Group ${groupDynamicIndex}` : `${id}. ${generateText()}`,
    image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
  });
  GROUP_DYNAMIC_ITEMS_STICKY_MAP[id] = {
    sticky: type === 'group-header' ? 1 : 0,
    selectable: !isGroup,
    collapsable: isGroup,
  };
}

export {
  GROUP_DYNAMIC_ITEMS,
  GROUP_DYNAMIC_ITEMS_STICKY_MAP,
  ITEMS,
};
