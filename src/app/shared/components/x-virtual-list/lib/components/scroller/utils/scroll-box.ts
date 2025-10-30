import { ScrollerDirection, ScrollerDirections } from "../enums";

interface ICalculateScrollParams {
    direction: ScrollerDirections;
    viewportWidth: number;
    viewportHeight: number;
    contentWidth: number;
    contentHeight: number;
    positionX: number;
    positionY: number;
}

const MIN_THUMB_SIZE = 40;

export class ScrollBox {
    calculateScroll({
        direction,
        viewportWidth,
        viewportHeight,
        contentWidth,
        contentHeight,
        positionX,
        positionY,
    }: ICalculateScrollParams) {
        const isVertical = direction === ScrollerDirection.VERTICAL;
        let x = 0, y = 0, thumbPosition = 0, thumbSize = 0;
        if (isVertical) {
            y = positionY;
            const ratio = contentHeight > 0 ? viewportHeight / contentHeight : 1;
            thumbSize = Math.max(viewportHeight * ratio, MIN_THUMB_SIZE);
            thumbPosition = viewportHeight * (contentHeight > 0 ? y / contentHeight : 0);
        } else {
            x = positionX;
            const ratio = contentWidth > 0 ? viewportWidth / contentWidth : 1;
            thumbSize = Math.max(viewportWidth * ratio, MIN_THUMB_SIZE);
            thumbPosition = viewportWidth * (contentWidth > 0 ? x / contentWidth : 0);
        }

        return {
            x,
            y,
            thumbSize,
            thumbPosition,
        };
    }
}