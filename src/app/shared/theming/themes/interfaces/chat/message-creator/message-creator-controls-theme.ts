import { ButtonPresets } from "../../../presets";
import { IButtonTheme } from "../../components/button";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessageCreatorControlsTheme {
    send: ButtonPresets | IButtonTheme;
    cancel: ButtonPresets | IButtonTheme;
}