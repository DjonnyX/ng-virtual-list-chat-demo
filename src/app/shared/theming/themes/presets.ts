enum ButtonPresets {
    PRIMARY = 'x-button-primary',
    SECONDARY = 'x-button-secondary',
    THRID = 'x-button-thrid',
    SUCCESS = 'x-button-success',
    CANCEL = 'x-button-cancel',
    WARN = 'x-button-warn',
    CONTEXT_MENU_PRIMARY = 'x-context-menu-button-primary',
    CONTEXT_MENU_SECONDARY = 'x-context-menu-button-secondary',
}

const BUTTON_PRESETS = [
    ButtonPresets.PRIMARY,
    ButtonPresets.SECONDARY,
    ButtonPresets.THRID,
    ButtonPresets.SUCCESS,
    ButtonPresets.CANCEL,
    ButtonPresets.WARN,
    ButtonPresets.CONTEXT_MENU_PRIMARY,
    ButtonPresets.CONTEXT_MENU_SECONDARY,
];

enum DialogPresets {
    PRIMARY = 'x-dialog-primary',
    SECONDARY = 'x-dialog-secondary',
}

const DIALOG_PRESETS = [
    DialogPresets.PRIMARY,
    DialogPresets.SECONDARY,
];

enum ContextMenuPresets {
    PRIMARY = 'x-context-menu-primary',
    SECONDARY = 'x-context-menu-secondary',
}

const CONTEXT_MENU_PRESETS = [
    ContextMenuPresets.PRIMARY,
    ContextMenuPresets.SECONDARY,
];

const PRESETS: Array<string> = [...BUTTON_PRESETS, ...DIALOG_PRESETS, ...CONTEXT_MENU_PRESETS];

export {
    ButtonPresets,
    BUTTON_PRESETS,
    ContextMenuPresets,
    CONTEXT_MENU_PRESETS,
    DialogPresets,
    DIALOG_PRESETS,
    PRESETS,
}
