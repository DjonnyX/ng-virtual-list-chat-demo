import { SubstarateModes } from "../enums/substrate-modes";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export type SubstarateMode = SubstarateModes.RECTANGLE | SubstarateModes.ROUNDED_RECTANGLE | SubstarateModes.CIRCLE
    | 'rectangle' | 'circle' | 'rounded-rectangle';
