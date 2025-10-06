import { Injectable } from '@angular/core';
import { GroupsService } from './groups.service';
import { Id, IVirtualListCollection } from '@shared/components/ng-virtual-list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsWebsocketService implements GroupsService {
  constructor() { }

  getGroups(projectId: string): Observable<IVirtualListCollection<any>> {
    throw new Error('Method not implemented.');
  }

  createGroup(group: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  updateGroup(group: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  deleteGroup(groupId: Id): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
