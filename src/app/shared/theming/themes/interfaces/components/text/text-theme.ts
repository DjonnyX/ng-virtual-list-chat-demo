/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ITextTheme {
    fontSize: number | string;
    color: string;
    textAlign: 'left' | 'right' | 'center';
    fontWeight: 'normal' | 'bold' | 'bolder';
    textTransform: 'lowercase' | 'uppercase' | 'none';
}