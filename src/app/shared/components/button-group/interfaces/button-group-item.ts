import { IButton } from "@shared/components/button";
import { Id } from "@shared/components/ng-virtual-list";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IButtonGroupItem extends Partial<IButton> {
    id: Id;
}