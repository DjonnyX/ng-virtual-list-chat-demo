import { Color } from "@shared/types";

interface IChatGroupState {
    fill: Color;
    color: Color;
    iconColor: Color;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IChatsTheme {
    group: {
        background: Color;
        normal: IChatGroupState;
        focused: IChatGroupState;
        selected: IChatGroupState;
        selectedFocused: IChatGroupState;
    };
}