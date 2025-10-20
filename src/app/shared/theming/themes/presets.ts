enum ButtonPresets {
    PRIMARY = 'x-button-primary',
    SECONDARY = 'x-button-secondary',
    THRID = 'x-button-thrid',
    SUCCESS = 'x-button-success',
    CANCEL = 'x-button-cancel',
    WARN = 'x-button-warn',
}

const BUTTON_PRESETS = [
    ButtonPresets.PRIMARY,
    ButtonPresets.SECONDARY,
    ButtonPresets.THRID,
    ButtonPresets.SUCCESS,
    ButtonPresets.CANCEL,
    ButtonPresets.WARN,
];

enum DialogPresets {
    PRIMARY = 'x-dialog-primary',
    SECONDARY = 'x-dialog-secondary',
}

const DIALOG_PRESETS = [
    DialogPresets.PRIMARY,
    DialogPresets.SECONDARY,
];

const PRESETS: Array<string> = [...BUTTON_PRESETS, ...DIALOG_PRESETS];

export {
    ButtonPresets,
    BUTTON_PRESETS,
    DialogPresets,
    DIALOG_PRESETS,
    PRESETS,
}
