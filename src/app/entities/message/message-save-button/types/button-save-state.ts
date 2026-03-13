import { MessageButtonSaveStates } from "../enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export type MessageButtonSaveState = MessageButtonSaveStates.CANCEL | MessageButtonSaveStates.SEND | 'cancel' | 'send';
