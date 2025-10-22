import { IButtonTheme } from "../components/button";
import { IChatSearchTheme } from "./chat-search";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IChatHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: IChatSearchTheme;
}