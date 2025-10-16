import { Id } from "@shared/components/ng-virtual-list";

export interface IMessageItemData {
  id: Id;
  dateTime: number;
  name: string;
  edited?: boolean;
  incomType?: 'in' | 'out',
  type: 'item' | 'group-header' | 'typing-indicator',
}