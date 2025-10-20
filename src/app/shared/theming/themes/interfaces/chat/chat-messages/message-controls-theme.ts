import { ButtonPresets } from "../../../presets";
import { IIconButtonStates } from "../../common/icon-button-states";

export interface IMessageControlsTheme {
    menu: ButtonPresets | IIconButtonStates;
    send: ButtonPresets | IIconButtonStates;
    cancel: ButtonPresets | IIconButtonStates;
}