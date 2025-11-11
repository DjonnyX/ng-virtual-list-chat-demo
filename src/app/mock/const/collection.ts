import { IVirtualListCollection } from "@shared/components/x-virtual-list";
import { MessageTypes } from "@shared/enums";
import { IMessage } from "@widgets/messages";
import { generateText, generateWord } from "../utils";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const generateChatCollection = () => {
  const items: IVirtualListCollection = [];

  for (let i = 0, l = 10 + Math.random() * 200; i < l; i++) {
    const id = i + 1;
    items.push({ id, text: `${generateWord(30, true)}` });
  }
  return items;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const COLLECTION_PARAMS = {
  maxDate: Date.now(),
  index: 0,
  groupIndex: 0,
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const testLinksText = () => {
  return `Test links:
https://media4.giphy.com/media/WoF3yfYupTt8mHc7va/200w.gif
http://eugene-grebennikov.pro/`;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IMessage> = [], chunkSize = size; //  (number === 1 ? 1 + Math.round(Math.random() * size) : size);

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1,
      incomType = Math.random() > .5 ? 'in' : 'out';

    COLLECTION_PARAMS.index++;

    const hasImage = Boolean(Math.round(Math.random() * 0.75));
    items.push({
      id,
      version: 0,
      dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * 2000000, text: `${id}. ${[1].includes(id) ? testLinksText() : generateText()}`,
      image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined, incomType,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
