import { IButton } from "@shared/components/button";
import { Id } from "@shared/components/ng-virtual-list";

export interface IButtonGroupItem extends Partial<IButton> {
    id: Id;
}