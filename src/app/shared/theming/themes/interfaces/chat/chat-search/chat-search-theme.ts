interface IChatSearchStateTheme {
    background?: string;
    borderColor?: string;
    color?: string;
    fill?: string;
    fontSize?: string;
    placeholder?: {
        fontSize?: string;
        color?: string;
    },
}

export interface IChatSearchTheme {
    timeoutIndicatorColor: string;
    normal: IChatSearchStateTheme;
    focused: IChatSearchStateTheme;
}
