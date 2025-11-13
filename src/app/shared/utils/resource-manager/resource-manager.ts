import { CMap } from "../cmap";
import { EventEmitter } from "../event-emitter";
import { Thread, ThreadManager } from "../thread-manager";

export enum ResourceStatus {
    NOT_ADDED,
    WAITING,
    LOADING,
    LOADED,
    ERROR,
}

export enum ResourceManagerEvents {
    PROGRESS = 'progress',
}

type ResourceManagerProgressListener = (url: string) => void;

type ResourceManagerListeners = ResourceManagerProgressListener;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
class ResourceManager extends EventEmitter<ResourceManagerEvents, ResourceManagerListeners> {
    private static _instance: ResourceManager;

    private _threadManager = new ThreadManager({
        maxThreads: 4,
    });

    private _map = new CMap<string, string>();

    private _statusMap = new CMap<string, ResourceStatus>();

    constructor() {
        super();
        if (ResourceManager._instance) {
            throw Error('ResourceManager already initialized.');
        }
        ResourceManager._instance = this;

        this._threadManager.run();
    }

    add(url: string) {
        this._statusMap.set(url, ResourceStatus.WAITING);
        const thread = new Thread({
            onStart: async () => {
                this._statusMap.set(url, ResourceStatus.LOADING);
                const resource = await (new Promise<string | undefined>((resolve) => {
                    try {
                        fetch(url, {
                            cache: 'no-cache',
                            priority: 'auto',
                        }).then(res => {
                            if (!res.ok) {
                                throw Error('Loading error');
                            }
                            return res.blob();
                        }).then(imgBlob => {
                            try {
                                const fileReader = new FileReader();
                                fileReader.onload = () => { resolve(fileReader.result?.toString()); };
                                fileReader.onerror = () => { resolve(undefined); };
                                fileReader.readAsDataURL(imgBlob);
                            } catch (err) {
                                resolve(undefined);
                            }
                        }).catch(err => {
                            resolve(undefined);
                        });
                    } catch (e) {
                        resolve(undefined);
                    }
                }));

                if (resource) {
                    this._map.set(url, resource);
                    this._statusMap.set(url, ResourceStatus.LOADED);
                    this.dispatch(ResourceManagerEvents.PROGRESS, url);
                    return;
                }

                this._statusMap.set(url, ResourceStatus.ERROR);
                this.dispatch(ResourceManagerEvents.PROGRESS, url);
            },
        });
        this._threadManager.add(thread);
    }

    getStatus(url: string): ResourceStatus {
        const status = this._statusMap.get(url);
        if (status !== undefined) {
            return status;
        }
        return ResourceStatus.NOT_ADDED;
    }

    has(url: string) {
        return this._map.has(url);
    }

    get(url: string) {
        return this._map.get(url);
    }

    clear() {
        return this._map.clear();
    }
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const resourceManager = new ResourceManager();
