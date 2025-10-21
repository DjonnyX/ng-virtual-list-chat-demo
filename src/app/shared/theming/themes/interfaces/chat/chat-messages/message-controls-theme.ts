import { ButtonPresets } from "../../../presets";
import { IButtonTheme } from "../../components/button";

export interface IMessageControlsTheme {
    menu: ButtonPresets | IButtonTheme;
    send: ButtonPresets | IButtonTheme;
    cancel: ButtonPresets | IButtonTheme;
}