import { Id } from "@shared/components/ng-virtual-list";
import { MessageTypes } from "@shared/enums";

export interface IMessageItemData {
  id: Id;
  dateTime: number;
  name: string;
  edited?: boolean;
  incomType?: 'in' | 'out',
  type: MessageTypes.ITEM | MessageTypes.GROUP | MessageTypes.TYPING_INDICATOR,
}