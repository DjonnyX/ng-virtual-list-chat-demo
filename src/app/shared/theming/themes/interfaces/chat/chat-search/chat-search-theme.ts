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
    normal: IChatSearchStateTheme;
    focused: IChatSearchStateTheme;
}
