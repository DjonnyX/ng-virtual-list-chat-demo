/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IAnswer<D = any, E = any> {
    data?: D;
    error?: E;
}
