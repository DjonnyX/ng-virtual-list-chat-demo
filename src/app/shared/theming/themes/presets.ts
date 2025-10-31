/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
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

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
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

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
enum CheckboxPresets {
    PRIMARY = 'x-checkbox-primary',
    SECONDARY = 'x-checkbox-secondary',
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const CHECKBOX_PRESETS = [
    CheckboxPresets.PRIMARY,
    CheckboxPresets.SECONDARY,
];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
enum DialogPresets {
    PRIMARY = 'x-dialog-primary',
    SECONDARY = 'x-dialog-secondary',
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const DIALOG_PRESETS = [
    DialogPresets.PRIMARY,
    DialogPresets.SECONDARY,
];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
enum ContextMenuPresets {
    PRIMARY = 'x-context-menu-primary',
    SECONDARY = 'x-context-menu-secondary',
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const CONTEXT_MENU_PRESETS = [
    ContextMenuPresets.PRIMARY,
    ContextMenuPresets.SECONDARY,
];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
const PRESETS: Array<string> = [...BUTTON_PRESETS, ...CHECKBOX_PRESETS, ...DIALOG_PRESETS, ...CONTEXT_MENU_PRESETS];

export {
    ButtonPresets,
    BUTTON_PRESETS,
    CheckboxPresets,
    CHECKBOX_PRESETS,
    ContextMenuPresets,
    CONTEXT_MENU_PRESETS,
    DialogPresets,
    DIALOG_PRESETS,
    PRESETS,
}
