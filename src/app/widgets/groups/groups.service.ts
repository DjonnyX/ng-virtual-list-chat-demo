import { Observable } from "rxjs";
import { Id, IVirtualListCollection } from "@shared/components/ng-virtual-list";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export abstract class GroupsService {
    abstract getGroups(projectId: string): Observable<IVirtualListCollection<any>>;

    abstract createGroup(group: any): Observable<any>;

    abstract updateGroup(group: any): Observable<any>;

    abstract deleteGroup(groupId: Id): Observable<void>;
}