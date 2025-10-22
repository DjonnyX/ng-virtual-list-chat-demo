import { ButtonPresets } from "../../../presets";
import { IButtonTheme } from "../../components/button";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageControlsTheme {
    menu: ButtonPresets | IButtonTheme;
    send: ButtonPresets | IButtonTheme;
    cancel: ButtonPresets | IButtonTheme;
}