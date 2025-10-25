import { TemplateRef } from '@angular/core';
import { Id, ISize } from '../types';
import { IRenderVirtualListItem } from './render-item.model';

/**
 * Virtual List Item Interface
 * @link The commertial fork of https://github.com/DjonnyX/ng-virtual-list/blob/19.x/projects/ng-virtual-list/src/lib/models/base-virtual-list-item-component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * The commertial fork https://github.com/djonnyx/ng-virtual-list
 * All rights reserved.
 */
export abstract class BaseVirtualListItemComponent {
    abstract get id(): number;
    abstract regular: boolean;
    abstract set regularLength(v: string)
    abstract set item(v: IRenderVirtualListItem | null | undefined);
    abstract get item(): IRenderVirtualListItem | null | undefined;
    abstract get itemId(): Id | undefined;
    abstract set renderer(v: TemplateRef<any> | undefined);
    abstract get element(): HTMLElement;
    public abstract getBounds(): ISize;
    public abstract show(): void;
    public abstract hide(): void;
}