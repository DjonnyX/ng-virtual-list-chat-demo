/**
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export interface IMessageParams {
    reseted: boolean;
    isRTL: boolean;
    type: string | undefined;
    prevType: string | undefined;
    nextType: string | undefined;
    isIncoming: boolean;
    isOutgoing: boolean;
    prevIsIncoming: boolean;
    prevIsOutgoing: boolean;
    nextIsIncoming: boolean;
    nextIsOutgoing: boolean;
};
