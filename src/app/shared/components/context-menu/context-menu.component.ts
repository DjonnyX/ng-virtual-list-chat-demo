import { Component, input, output } from '@angular/core';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { IContextMenuCollection } from './interfaces/context-menu-collection.interface';
import { Id } from '../ng-virtual-list';
import { ButtonComponent } from '../button';

@Component({
  selector: 'x-context-menu',
  imports: [CdkMenu, CdkMenuItem, ButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  items = input.required<IContextMenuCollection>();

  onClick = output<{ id: Id, event: Event }>();

  onItemClickHandler(event: Event, id: Id) {
    this.onClick.emit({ id, event });
  }
}
