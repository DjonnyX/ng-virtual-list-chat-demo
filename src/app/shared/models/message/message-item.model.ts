import { Id } from "@shared/components/ng-virtual-list";
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageItemData {
  id: Id;
  quoteId?: Id;
  dateTime: number;
  mailed: boolean;
  text: string;
  edited?: boolean;
  incomType?: 'in' | 'out',
  type?: MessageTypes,
}