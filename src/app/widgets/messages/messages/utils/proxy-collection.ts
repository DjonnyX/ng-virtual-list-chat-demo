import { Id } from "@shared/components/ng-virtual-list";
import { EventEmitter } from "@shared/components/ng-virtual-list/lib/utils/event-emitter";

export type CollectionItem<D = any> = { id: Id, dateTime: number } & D;

export interface IProxyCollectionItem<D = any> {
    id: Id,
    edited: boolean;
    selected: boolean;
    animate: boolean;
    deleting: boolean;
    deleted: boolean;
    removal: boolean;
    processing: boolean;
    tmpName: string | undefined;
    data: CollectionItem<D>;
}

const createProxyItem = <D = any>(data: CollectionItem<D>
    , params: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>> = {}):
    IProxyCollectionItem<D> => ({
        edited: false,
        selected: false,
        animate: false,
        deleting: false,
        deleted: false,
        removal: false,
        processing: false,
        tmpName: undefined,
        ...params,
        id: data.id,
        data,
    });

const sortByDateTime = (a: IProxyCollectionItem<any>, b: IProxyCollectionItem<any>) => {
    if (a.data.dateTime > b.data.dateTime) {
        return 1;
    }
    if (a.data.dateTime < b.data.dateTime) {
        return -1;
    }
    return 0;
}

export enum ProxyCollectionEvents {
    CHANGE = 'change',
};

type TProxyCollectionEvents = ProxyCollectionEvents.CHANGE;

type TProxyCollectionChangeHandler = () => void;

type TProxyCollectionEventHandlers = TProxyCollectionChangeHandler;

export class ProxyCollection<D = any> extends EventEmitter<TProxyCollectionEvents, TProxyCollectionEventHandlers> {
    protected _dict: { [id: Id]: IProxyCollectionItem<D> } = {};

    protected _collection = new Array<IProxyCollectionItem<D>>();

    constructor(from: Array<CollectionItem<D>>) {
        super();
        this.from(from);
    }

    get(id: Id) {
        return this._dict[id] ?? null;
    }

    has(id: Id) {
        return (this._dict[id] ?? null) !== null;
    }

    set(id: Id, data: CollectionItem<D>, params?: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>>) {
        const dict = this._dict, collection = this._collection, item = dict[id];
        if (item) {
            item.data = { ...item.data, ...data };
            if (params) {
                const index = collection.findIndex(({ id: itemId }) => itemId === id);
                if (index > -1) {
                    collection[index] = { ...collection[index], ...params };
                    dict[id] = collection[index];
                }
            }
        } else {
            const proxyItem = createProxyItem(data, params);
            collection.push(proxyItem);
            dict[id] = proxyItem;
        }

        this._collection = collection.sort(sortByDateTime);

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    setParams(id: Id, params?: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>>) {
        const dict = this._dict, collection = this._collection, item = dict[id];
        if (item) {
            if (params) {
                const index = collection.findIndex(({ id: itemId }) => itemId === id);
                if (index > -1) {
                    collection[index] = { ...collection[index], ...params };
                    dict[id] = collection[index];
                }
            }
        }

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    delete(id: Id) {
        const index = this._collection.findIndex(({ id: itemId }) => itemId === id);
        if (index > -1) {
            this._collection.splice(index, 1);
            delete this._dict[id];
        }

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    from(src: Array<CollectionItem<D>>, append: boolean = false) {
        const dict = append ? this._dict : {}, collection = append ? this._collection : [];

        for (let i = 0, l = src.length; i < l; i++) {
            const item = src[i], id = item.id;
            if (dict[id]) {
                dict[id].data = { ...dict[id].data, ...item };
            } else {
                const proxyItem = createProxyItem(item);
                collection.push(proxyItem);
                dict[id] = proxyItem;
            }
        }

        this._collection = collection.sort(sortByDateTime);

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    toObject() {
        return [...this._collection];
    }
}