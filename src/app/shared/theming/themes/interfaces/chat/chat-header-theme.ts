import { IButtonTheme } from "../components/button";
import { IChatSearchTheme } from "./chat-search";

export interface IChatHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: IChatSearchTheme;
}