import { IMessageContainerStateTheme } from "./message-container-state-theme";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageContainerTheme {
    normal: IMessageContainerStateTheme;
    selected: IMessageContainerStateTheme;
    edited: IMessageContainerStateTheme;
}