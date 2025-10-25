import { IButtonTheme } from "../components/button";
import { IChatSearchTheme } from "./chat-search";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: IChatSearchTheme;
}