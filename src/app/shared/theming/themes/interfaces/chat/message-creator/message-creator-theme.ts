import { IMessageCreatorControlsTheme } from "./message-creator-controls-theme";

export interface IMessageCreatorTheme {
    background: string;
    input: {
        background: string;
        color: string;
        outline: string;
    },
    controls: IMessageCreatorControlsTheme;
}
