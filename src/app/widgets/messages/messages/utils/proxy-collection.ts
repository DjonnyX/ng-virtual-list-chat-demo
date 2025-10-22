import { Id } from "@shared/components/ng-virtual-list";
import { EventEmitter } from "@shared/components/ng-virtual-list/lib/utils/event-emitter";

export type CollectionItem<D = any> = { id: Id, dateTime: number, version: number, __deleted__?: boolean } & D;

export interface IProxyCollectionItem<D = any> {
    id: Id;
    version: number;
    edited: boolean;
    selected: boolean;
    animate: boolean;
    deleting: boolean;
    deleted: boolean;
    removal: boolean;
    processing: boolean;
    tmpText: string | undefined;
    data: CollectionItem<D>;
}

const createProxyItem = <D = any>(data: CollectionItem<D>
    , params: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>> = {}):
    CollectionItem<IProxyCollectionItem<D>> => ({
        version: -1,
        edited: false,
        selected: false,
        animate: false,
        deleting: false,
        deleted: false,
        removal: false,
        processing: false,
        tmpText: undefined,
        ...params,
        id: data.id,
        dateTime: data.dateTime,
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
    protected _dict: { [id: Id]: CollectionItem<IProxyCollectionItem<D>> } = {};

    protected _dictIndexes: { [id: Id]: number } = {};

    protected _collection = new Array<CollectionItem<IProxyCollectionItem<D>>>();
    get collection() { return this._collection; }

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
            const index = this._dictIndexes[id];
            if (index > -1) {
                collection[index] = { ...collection[index], ...(params ?? {}) };
                dict[id] = collection[index];
            }
        } else {
            const proxyItem = createProxyItem(data, params);
            collection.push(proxyItem);
            dict[id] = proxyItem;
        }

        this._collection = collection.sort(sortByDateTime);

        this.resetIndexes();

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    setParams(id: Id, params?: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>>) {
        const dict = this._dict, collection = this._collection, item = dict[id];
        if (item) {
            if (params) {
                const index = this._dictIndexes[id];
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
        const index = this._dictIndexes[id];
        if (index > -1) {
            this._collection.splice(index, 1);
            delete this._dict[id];
            this.resetIndexes();
        }

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    from(src: Array<CollectionItem<D>>, append: boolean = false) {
        if ((!src || src.length === 0) && !append) {
            this._dictIndexes = {};
            this._dict = {};
        }

        const dict = append ? this._dict : {}, collection = append ? this._collection : [];

        for (let i = 0, l = src.length; i < l; i++) {
            const item = src[i], id = item.id, dictItem = dict[id];
            if (dictItem) {
                if ((dictItem.version === undefined && item.version === 0) ||
                    (dictItem.version < item.version) ||
                    (dictItem.version === Number.MAX_SAFE_INTEGER && item.version === 0)) {
                    if (item.__deleted__) {
                        const index = this._dictIndexes[id];
                        if (index > -1) {
                            this._collection.splice(index, 1);
                            delete this._dict[id];
                        }
                    } else {
                        dict[id].data = { ...dict[id].data, ...item };
                        dict[id].version = item.version;
                        dict[id].dateTime = item.dateTime;
                    }
                }
            } else {
                if (item.__deleted__) {
                    const index = this._dictIndexes[id];
                    if (index > -1) {
                        this._collection.splice(index, 1);
                        delete this._dict[id];
                    }
                } else {
                    const proxyItem = createProxyItem(item);
                    collection.push(proxyItem);
                    dict[id] = proxyItem;
                }
            }
        }

        this._collection = collection.sort(sortByDateTime);

        this.resetIndexes();

        this.dispatch(ProxyCollectionEvents.CHANGE);

        return this._collection;
    }

    private resetIndexes() {
        const collection = this._collection, indexes: { [id: Id]: number } = {};
        for (let i = 0, l = collection.length; i < l; i++) {
            const item = collection[i], id = item.id;
            indexes[id] = i;
        }
        this._dictIndexes = indexes
    }

    toObject() {
        return [...this._collection];
    }
}