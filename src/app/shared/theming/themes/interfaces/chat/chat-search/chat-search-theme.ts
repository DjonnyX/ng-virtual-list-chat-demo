/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
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

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IChatSearchTheme {
    timeoutIndicatorColor: string;
    normal: IChatSearchStateTheme;
    focused: IChatSearchStateTheme;
}
