import { Component, DestroyRef, effect, ElementRef, inject, input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, map, switchMap, tap } from 'rxjs';
import { Color, GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { SubstarateMode } from './types/substrate-mode';
import { SubstarateModes } from './enums/substrate-modes';
import { SubstarateStyle } from './types';
import { SubstarateStyles } from './enums';
import { getShapeMinSize } from '@shared/utils';

const DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  RIPPLE_ANIMATE_CLASS = 'animate',
  DEFAULT_RIPPLE_COLOR = "rgba(0,0,0,0.1)",
  SHAPE_NAME = 'x-substrate-shape',
  CLIP_NAME = 'x-substrate-clip',
  GRADIENT_COLOR_NAME = 'stop-color',
  FILL_GRADIENT_NAME = 'x-substrate-fill-gradient',
  STROKE_GRADIENT_NAME = 'x-substrate-stroke-gradient';

const circlePath = (cx: number, cy: number, r: number) => {
  return 'M ' + cx + ' ' + cy + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,1 ' + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,1 -' + (r * 2) + ',0';
};

const roundedRectPath = (width: number, height: number, tl: number, tr: number, br: number, bl: number) => {
  const top = width - tl - tr;
  const right = height - tr - br;
  const bottom = width - br - bl;
  const left = height - bl - tl;
  const d = `
        M${tl},0
        h${top}
        a${tr},${tr} 0 0 1 ${tr},${tr}
        v${right}
        a${br},${br} 0 0 1 -${br},${br}
        h-${bottom}
        a${bl},${bl} 0 0 1 -${bl},-${bl}
        v-${left}
        a${tl},${tl} 0 0 1 ${tl},-${tl}
        z
    `;
  return d;
};

@Component({
  selector: 'x-substrate',
  imports: [],
  templateUrl: './substrate.component.html',
  styleUrl: './substrate.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class SubstrateComponent {
  private static __id: number = 0;
  private static get nextId() {
    const id = SubstrateComponent.__id = SubstrateComponent.__id + 1 === Number.MAX_SAFE_INTEGER ? 0 : SubstrateComponent.__id + 1;
    return id;
  }

  private _id: number;

  get id() { return this._id; }

  svg = viewChild<ElementRef<SVGElement>>('svg');

  rippleShape = viewChild<ElementRef<SVGCircleElement>>('ripple');

  clip = viewChild<ElementRef<SVGClipPathElement>>('clip');

  clipUse = viewChild<ElementRef<SVGUseElement>>('clipUse');

  shape = viewChild<ElementRef<SVGUseElement>>('shape');

  hilight = viewChild<ElementRef<SVGUseElement>>('hilight');

  path = viewChild<ElementRef<SVGPathElement>>('path');

  fillGradient = viewChild<ElementRef<SVGPathElement>>('fillGradient');

  strokeGradient = viewChild<ElementRef<SVGPathElement>>('strokeGradient');

  fillGradientColor1 = viewChild<ElementRef<SVGStopElement>>('fillGradientColor1');

  fillGradientColor2 = viewChild<ElementRef<SVGStopElement>>('fillGradientColor2');

  strokeGradientColor1 = viewChild<ElementRef<SVGStopElement>>('strokeGradientColor1');

  strokeGradientColor2 = viewChild<ElementRef<SVGStopElement>>('strokeGradientColor2');

  strokeAnimation = viewChild<ElementRef<SVGAnimateTransformElement>>('strokeAnimation');

  mode = input.required<SubstarateMode>();

  width = input.required<number>();

  height = input.required<number>();

  roundCorner = input<RoundedCorner | undefined>(undefined);

  type = input<SubstarateStyle>(SubstarateStyles.NONE);

  strokeColors = input<GradientColor>();

  strokeAnimationDuration = input<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  rippleColor = input<Color | undefined>(DEFAULT_RIPPLE_COLOR);

  fillColors = input<GradientColor | undefined>(undefined);

  fillColorPositions = input<GradientColorPositions | undefined>(undefined);

  rippleEnabled = signal<boolean>(false);

  private _destroyRef = inject(DestroyRef);

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  constructor() {
    this._id = SubstrateComponent.nextId;

    effect(() => {
      const fillColors = this.fillColors();
      if (Array.isArray(fillColors) && fillColors.length === 2) {
        const fillGradientColor1 = this.fillGradientColor1(), fillGradientColor2 = this.fillGradientColor2();
        if (fillGradientColor1 && fillGradientColor2) {
          fillGradientColor1.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${fillColors[0]}`);
          fillGradientColor2.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${fillColors[1]}`);

          const shape = this.shape()?.nativeElement;
          if (shape) {
            shape.setAttribute('fill', `url(#${FILL_GRADIENT_NAME}${this._id})`);
          }
        }
      } else {
        const shape = this.shape()?.nativeElement;
        if (shape) {
          shape.setAttribute('fill', `inherit`);
        }
      }
    });

    effect(() => {
      const strokeAnimationDuration = this.strokeAnimationDuration(), strokeAnimation = this.strokeAnimation()?.nativeElement;
      if (strokeAnimation) {
        strokeAnimation.setAttribute('dur', `${strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION}ms`);
      }
    });

    effect(() => {
      const fillColorPositions = this.fillColorPositions();
      if (Array.isArray(fillColorPositions) && fillColorPositions.length === 2) {
        const fillGradient = this.fillGradient();
        if (fillGradient) {
          fillGradient.nativeElement.setAttribute('x1', `${fillColorPositions[0]}px`);
          fillGradient.nativeElement.setAttribute('x2', `${fillColorPositions[1]}px`);
        }
      }
    });

    effect(() => {
      const strokeColors = this.strokeColors();
      if (Array.isArray(strokeColors) && strokeColors.length === 2) {
        const strokeGradientColor1 = this.strokeGradientColor1(), strokeGradientColor2 = this.strokeGradientColor2();
        if (strokeGradientColor1 && strokeGradientColor2) {
          strokeGradientColor1.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${strokeColors[0]}`);
          strokeGradientColor2.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${strokeColors[1]}`);
        }
      }
    });

    effect(() => {
      const fillGradient = this.fillGradient();
      if (fillGradient) {
        fillGradient.nativeElement.setAttribute('id', `${FILL_GRADIENT_NAME}${this._id}`);
      }
    });

    effect(() => {
      const strokeGradient = this.strokeGradient();
      if (strokeGradient) {
        strokeGradient.nativeElement.setAttribute('id', `${STROKE_GRADIENT_NAME}${this._id}`);
      }
    });

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
      const hilight = this.hilight();
      if (hilight) {
        hilight.nativeElement.setAttribute('clip-path', `url(#${CLIP_NAME}${this._id})`);
        hilight.nativeElement.setAttribute('href', `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const rippleShape = this.rippleShape();
      if (rippleShape) {
        rippleShape.nativeElement.setAttribute('clip-path', `url(#${CLIP_NAME}${this._id})`);
      }
    });

    effect(() => {
      const svg = this.svg()?.nativeElement, path = this.path()?.nativeElement, roundCorner = this.roundCorner(), minSize = getShapeMinSize(roundCorner),
        ww = (this.width() || minSize), w = ww >= minSize ? ww : minSize,
        hh = (this.height() || minSize), h = hh >= minSize ? hh : minSize;
      if (svg && path) {
        svg.style.width = `${w}px`;
        svg.style.height = `${h}px`;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        switch (this.mode()) {
          case SubstarateModes.CIRCLE: {
            const r = Math.min(w, h) * .5, shape = circlePath(w * .5, h * .5, r);
            path.setAttribute('d', shape);
            break;
          }
          case SubstarateModes.ROUNDED_RECTANGLE: {
            const corner = Array.isArray(roundCorner) && roundCorner.length === 4 ? roundCorner : [0, 0, 0, 0];
            const shape = roundedRectPath(w, h, corner[0], corner[1], corner[2], corner[3]);
            path.setAttribute('d', shape);
            break;
          }
          case SubstarateModes.RECTANGLE:
          default: {
            const shape = roundedRectPath(w, h, 0, 0, 0, 0);
            path.setAttribute('d', shape);
            break;
          }
        }
      }
    });

    effect(() => {
      const type = this.type(), shape = this.shape()?.nativeElement;
      if (shape) {
        switch (type) {
          case SubstarateStyles.STROKE: {
            shape.setAttribute('stroke', `url(#${STROKE_GRADIENT_NAME}${this._id})`);
            break;
          }
          case SubstarateStyles.NONE:
          default:
            shape.setAttribute('stroke', 'none');
            break;
        }
      }
    });

    effect(() => {
      const type = this.type(), hilight = this.hilight()?.nativeElement;
      if (hilight) {
        switch (type) {
          case SubstarateStyles.STROKE: {
            hilight.setAttribute('stroke', `url(#${STROKE_GRADIENT_NAME}${this._id})`);
            break;
          }
          case SubstarateStyles.NONE:
          default:
            hilight.setAttribute('stroke', 'none');
            break;
        }
      }
    });

    const $rippleShape = toObservable(this.rippleShape),
      $rippleEnabled = toObservable(this.rippleEnabled);

    $rippleShape.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(rippleShape => {
        return $rippleEnabled.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(v => !!v),
          tap(() => {
            if (rippleShape) {
              rippleShape.classList.add(RIPPLE_ANIMATE_CLASS);
            }
          }),
          delay(800),
          tap(() => {
            rippleShape.classList.remove(RIPPLE_ANIMATE_CLASS);
            this.rippleEnabled.set(false);
          }),
        );
      }),
    ).subscribe();
  }

  ripple(e: PointerEvent) {
    const { x, y, width, height } = (this._elementRef.nativeElement as HTMLDivElement).getBoundingClientRect(),
      localX = e.clientX - x, localY = e.clientY - y, rippleColor = this.rippleColor() ?? DEFAULT_RIPPLE_COLOR, endRadius = Math.max(width, height);
    const rippleShape = this.rippleShape()?.nativeElement;
    if (rippleShape) {
      rippleShape.setAttribute('cx', String(localX));
      rippleShape.setAttribute('cy', String(localY));
      rippleShape.setAttribute('r', String(endRadius));
      rippleShape.setAttribute('fill', rippleColor);
    }
    this.rippleEnabled.set(true);
  }
}
