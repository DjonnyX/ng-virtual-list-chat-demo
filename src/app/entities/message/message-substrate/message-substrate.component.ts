import { Component, effect, ElementRef, input, viewChild, ViewEncapsulation } from '@angular/core';
import { MessageSubstarateMode } from './types/message-substrate-mode';
import { MessageSubstarateModes } from './enums/message-substrate-modes';
import { MessageSubstarateStyle } from './types';
import { MessageSubstarateStyles } from './enums';

const LEFT_WIDTH = 17.5,
  RIGHT_WIDTH = 13,
  TOP_HEIGHT = 13,
  BOTTOM_HEIGHT = 13,
  SHAPE_NAME = 'shape',
  CLIP_NAME = 'clip';

@Component({
  selector: 'message-substrate',
  imports: [],
  templateUrl: './message-substrate.component.html',
  styleUrl: './message-substrate.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageSubstrateComponent {
  private static __id: number = 0;
  private static get nextId() {
    const id = MessageSubstrateComponent.__id = MessageSubstrateComponent.__id + 1;
    return id;
  }

  private _id: number;

  svg = viewChild<ElementRef<SVGElement>>('svg');

  clip = viewChild<ElementRef<SVGClipPathElement>>('clip');

  clipUse = viewChild<ElementRef<SVGUseElement>>('clipUse');

  shape = viewChild<ElementRef<SVGUseElement>>('shape');

  path = viewChild<ElementRef<SVGPathElement>>('path');

  mode = input.required<MessageSubstarateMode>();

  width = input.required<number>();

  height = input.required<number>();

  styles = input<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  constructor() {
    this._id = MessageSubstrateComponent.nextId;

    effect(() => {
      const path = this.path();
      if (path) {
        path.nativeElement.setAttribute('id', `${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const clip = this.clip();
      if (clip) {
        clip.nativeElement.setAttribute('id', `${CLIP_NAME}${this._id}`);
      }
    });

    effect(() => {
      const clipUse = this.clipUse();
      if (clipUse) {
        clipUse.nativeElement.setAttribute('href', `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const shape = this.shape();
      if (shape) {
        shape.nativeElement.setAttribute('clip-path', `url(#${CLIP_NAME}${this._id})`);
        shape.nativeElement.setAttribute('href', `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const svg = this.svg()?.nativeElement, path = this.path()?.nativeElement,
        ww = (this.width() ?? 0), w = ww > 0 ? ww - (LEFT_WIDTH + RIGHT_WIDTH + 10) : 0,
        hh = (this.height() ?? 0), h = hh > 0 ? hh - (TOP_HEIGHT + BOTTOM_HEIGHT + 10) : 0;
      if (svg && path) {
        svg.style.width = `${ww}px`;
        svg.style.height = `${hh}px`;
        svg.setAttribute('viewBox', `0 0 ${ww} ${hh}`);
        switch (this.mode()) {
          case MessageSubstarateModes.LEFT:
          case MessageSubstarateModes.RIGHT: {
            const shape = `M ${44.043 + w - 5} 13.2 c 0 -7.285 -5.913 -13.2 -13.196 -13.2 L 13.239 0 c -7.283 0 -13.196 5.915 -13.196 13.2 L 0.043 ${h + 23} c 0 7.285 5.913 13.2 13.196 13.2 l ${17.608 + w - 5} 0 c 7.283 0 13.196 -5.915 13.196 -13.2 Z`;
            path.setAttribute('d', shape);
            break;
          }
          case MessageSubstarateModes.IN_LEFT: {
            const shape = `M 26.485 0 c -7.15 0 -12.954 5.835 -12.954 13.022 l 0 ${h} c 0 6.304 -1.651 11.287 -6.382 15.423 c -1.498 1.309 -3.686 2.575 -5.992 3.7 c -0.908 0.535 -1.349 1.614 -1.077 2.637 c 0.272 1.022 1.19 1.735 2.243 1.742 c 7.244 0.079 16.514 0.131 24.162 0.131 l ${w} 0 c 7.15 0 12.954 -5.835 12.954 -10.022 l 0 ${-(h + 13.956)} c 0 -7.187 -5.804 -13.022 -12.954 -13.022 Z`;
            path.setAttribute('d', shape);
            break;
          }
          case MessageSubstarateModes.IN_RIGHT: {
            const shape = `M${9 + w},0l4.516,0c7.15,0 12.954,5.835 12.954,13.022c-0,0 -0,-2.958 -0,${h}c-0,6.304 1.651,11.287 6.382,15.423c1.498,1.309 3.686,2.575 5.992,3.7c0.908,0.535 1.349,1.614 1.077,2.637c-0.272,1.022 -1.19,1.735 -2.243,1.742c-7.244,0.079 -16.514,0.131 ${-(w + 19.162)},0.131l-4.561,0c-7.15,0 -12.954,-5.835 -12.954,-13.022l0,${-(h + 10.8)}c0,-7.187 5.85,-13.022 12.999,-13.022Z`;
            path.setAttribute('d', shape);
            break;
          }
        }
      }
    });

    effect(() => {
      const styles = this.styles(), shape = this.shape()?.nativeElement;
      if (shape) {
        switch (styles) {
          case MessageSubstarateStyles.DELETING: {
            shape.setAttribute('stroke', `url(#deleting)`);
            break;
          }
          case MessageSubstarateStyles.DELETING: {
            shape.setAttribute('stroke', `url(#saving)`);
            break;
          }
          case MessageSubstarateStyles.NONE:
            default:
              shape.setAttribute('stroke', 'none');
              break;
        }
      }
    });
  }
}
