import type { ReactiveItem, Reactive } from '../types.ts'
import { reactive } from './reactive.ts'


//type items = Map<string, ReactiveItem>
//TODO: alternative to any
//type ReactiveItem = Reactive<any>
/* 
class List {
    name:string
    constructor(name:string) {
        this.name = name
    }
} */

class Store {
    items: Map<string, ReactiveItem>

    constructor() {
        this.items = new Map()
    }


    /**
     * Get storage item from key. It returns a reactive but it will not change storage when reactive changes.
     * @param key 
     * @returns 
     */
    get (key: string): ReactiveItem {
        //TODO: need typeguard for this to be not undefined
        return this.items.get(key) as ReactiveItem
    }


    /**
     * Set storage item with key. X[It takes a reactive] but it will not change storage when reactive changes.
     * @param key 
     * @param value 
     */
    set (key: string, value: unknown): ReactiveItem {
        //if key does not exist in items -> set key with reactive value
        if (!this.items.has(key)) {
            const r = reactive(value)
            this.items.set(key, r)
        }
        else {
            const item = this.items.get(key)
            if (item) item.value = value
        }


        //TODO: need typeguard for this to not be undefined
        return this.items.get(key) as ReactiveItem

    }

    update (key: string, value: Record<string, unknown>): boolean {


        if (this.has(key)) {
            const item = this.get(key)
            item.value = {
                ...item.value,
                ...value
            }
            return true
        }
        return false
    }

    /**
     * Determines if item is in items or stored
     * @param key 
     * @returns 
     */
    has (key: string) {
        return this.items.has(key)
    }


    /**
     * Returns a reactive, listens to trigger events and makes changes to storage.
     * If no storageItem with that key exists, it will be generated. If it already exists, it will be overwritten.
     * @param key 
     * @returns 
     */
    use = <T extends unknown> (key: string, def: T | null = null): Reactive<T> => {
        if (!this.has(key)) {
            this.set(key, def)
        }
        return this.get(key)
    }

    clear () {
        this.items.clear()
    }

    allFromList (list: string) {
        const item = this.get(list).value
        if (Array.isArray(item)) return item
    }

    lookup (list: string, propertyName: string, expected: any) {
        const wholeList = this.allFromList(list)
        if (wholeList) {
            return wholeList.filter(uid => this.get(uid).value[propertyName] === expected)
        }
        return undefined
    }


}

/**
 * Decorator to enable presistence on a Model.
 * @param store 
 * @returns 
 */
const persist = (store: Store) => (target: any) => {
    target.storeUseMethod = store.use
    return target
}

/**
 * Default ReactiveStore configuration
 */
/* const defaultConfig = {
   persistent: true,
   storeMethods: {
       getItem: (key: string) => self.localStorage.getItem(key) ? JSON.parse(self.localStorage.getItem(key) || '') : undefined,
       setItem: (key: string, value: unknown) => self.localStorage.setItem(key, JSON.stringify(value)),
       removeItem: self.localStorage.removeItem,
       clear: self.localStorage.clear
   }
}

export type ReactiveStoreConfig = typeof defaultConfig
export type StoreUserConfig = Partial<ReactiveStoreConfig>

export const reactiveStoreConfig = (userConfig?: StoreUserConfig): ReactiveStoreConfig => {
   return {
       ...defaultConfig,
       ...userConfig
   }
} */

export {
    Store,
    persist
}