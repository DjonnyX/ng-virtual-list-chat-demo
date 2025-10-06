export interface IMessageParams {
    type: string;
    prevType: string;
    nextType: string;
    isIncoming: boolean;
    isOutgoing: boolean;
    prevIsIncoming: boolean;
    prevIsOutgoing: boolean;
    nextIsIncoming: boolean;
    nextIsOutgoing: boolean;
};
