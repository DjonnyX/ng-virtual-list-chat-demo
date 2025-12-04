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

// hangs
// https://media4.giphy.com/media/WoF3yfYupTt8mHc7va/200w.gif
// 

export const testLinksText = () => {
  return `Test links:
  <i>⚙️ Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</i> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

  https://i0.wp.com/www.dogwonder.co.uk/wp-content/uploads/2009/12/tumblr_ku2pvuJkJG1qz9qooo1_r1_400.gif?resize=320%2C320
http://eugene-grebennikov.pro/`;
};

export const testFormattedText = () => {
  return `Formated text: <h3>🚀 What is Lorem Ipsum?</h3><b>✨ Lorem Ipsum is simply dummy text of the printing and typesetting industry.</b> <br/><i>⚙️ Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</i> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

- Fixed size (fastest)
- Dynamic size (auto-measured)
- Scrolling control
`;
};

export const testFormattedTable = () => {
  return `What does Upside-Down Face emoji 🙃 mean?
  <div class="wrapper">
    <div class="container">
        \`<div>
            <div>
              <span>HTML comment</span>
            </div>
        </div>\`
      </div>
</div>
Text \`Comment\` lorem ipsum
  https://media.tenor.com/UMs_iWeiCBMAAAAM/stitch-ruim-wave.gif
`;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IMessage> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1,
      incomType = Math.random() > .5 ? 'in' : 'out';

    COLLECTION_PARAMS.index++;

    const hasImage = Boolean(Math.round(Math.random() * 0.75)),
      type = Math.random() > .35 ? MessageTypes.MESSAGE : MessageTypes.QUOTE;
    items.push({
      id,
      quoteId: type === MessageTypes.QUOTE ? i + 10 : undefined,
      version: 0,
      mailed: true,
      type,
      dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * 2000000, text: `${id}. ${id % 4 === 0 ? testLinksText() : id % 3 === 0 ? testFormattedText() : id % 5 === 0 ? testFormattedTable() : generateText()}`,
      image: hasImage ? 'https://ng-virtual-list-chat-demo.eugene-grebennikov.pro/media/logo.png' : undefined,
      incomType,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
