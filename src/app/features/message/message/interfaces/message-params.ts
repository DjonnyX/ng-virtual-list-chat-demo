export interface IMessageParams {
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
