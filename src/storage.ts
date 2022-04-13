import { Reactive, ReactiveList } from '../types.ts'
import { Model } from './Model.ts'

/**
 * This class manages storing the actual data and maket it reactive. Also it stores all the models
 * and their foreign names.
 */
class PairisStore {
    cache = new Map<string, unknown>()
    storage: Storage | null = null
    modelStack = new ModelStack()
    eventStack = new Map<string, StoreEvent<unknown>>()

    constructor(storage?: Storage) {
        this.storage = storage || null
    }

    /**
     * Writes kes:value pair to the store. Triggers change event.
     * @param key 
     * @param value 
     */
    set<T> (key: string, value: T) {
        this.cache.set(key, value)
        if (this.storage) this.storage.setItem(key, JSON.stringify(value))
        this.eventStack.get(key)?.trigger()
    }

    /**
     * Returns a static value from the store.
     * @param key 
     * @returns 
     */
    get<T> (key: string) {
        if (!this.cache.has(key)) {
            const storedValue = this.storage?.getItem(key)
            if (storedValue) {
                this.cache.set(key, JSON.parse(storedValue))
            }
            else return undefined
        }
        return this.cache.get(key) as T
    }

    /**
     * Determines if key [key] is present in store.
     * @param key 
     * @returns 
     */
    has (key: string): boolean {
        return this.cache.has(key) || !!this.storage?.getItem(key)
    }

    /**
     * Delete an item from the store and any lists.
     * @param key 
     */
    delete (key: string) {
        //TODO: deleting from lists not yet implemented.
        //Should also delete UIDs from foreign properties. <- *should happen in Model Class
        this.storage?.removeItem(key) && this.cache.delete(key)
        this.eventStack.get(key)?.trigger()
        this.eventStack.delete(key)
    }

    /**
     * Returns a Reactive\<T\> from store. If key does not exist, it is generated.
     * Also listens for trigger events and updates the store accordingly.
     * @param key 
     * @returns 
     */
    use<T> (key: string): Reactive<T> {
        if (!this.eventStack.has(key)) this.eventStack.set(key, new StoreEvent())
        const event = this.eventStack.get(key) as StoreEvent<T>

        const getThis: () => T | undefined = () => this.get<T>(key)
        const setThis: (value: T) => void = (val: T) => this.set(key, val)

        return Object.defineProperty({
            subscribe: event.subscribe,
            trigger: event.trigger,
        } as unknown,
            'value',
            {
                get: function (): T | undefined {
                    return getThis()
                },
                set: function (v: T): void {
                    setThis(v)
                }
            }
        ) as Reactive<T>

    }

    /**
     * Deletes the the whole store including cache, events and storage. Models
     * will remain.
     */
    clear () {
        this.cache.clear()
        this.storage?.clear()
        this.eventStack.clear()
    }

    /**
     * Returns all items UIDs who's property [propertyName] equals value [expected].
     * @param listName 
     * @param propertyName 
     * @param expected 
     * @returns 
     */
    //TODO: move this to useList?
    lookup<T> (listName: string, propertyName: keyof T, expected: any)/* :Reactive<T>[] | undefined */ {
        const list = this.get<string[]>(listName)
        if (list && Array.isArray(list)) {
            return list.filter(uid => {
                if (this.has(uid)) {
                    const item = this.get<T>(uid)
                    return item && item[propertyName] === expected
                }
            })
        }
        return []
    }

    /**
     * Saves and returns a list from the store. If it does not exist it will be created. Triggers
     * an event on push.
     * @param listName 
     * @returns 
     */
    useList (listName: string): ReactiveList {

        if (!this.has(listName)) this.set(listName, [])

        const item = this.get(listName)

        if (!Array.isArray(item)) throw new Error(`${listName} is no list.`);

        if (!this.eventStack.has(listName)) this.eventStack.set(listName, new StoreEvent())
        const event = this.eventStack.get(listName) as StoreEvent<string[]>

        const push = (uid: string) => {
            item.push(uid)
            this.set(listName, item)
            //event.trigger()
        }

        const remove = (uid: string) => {
            this.set(listName, item.filter(val => val !== uid))
        }

        const getList = () => this.get(listName)

        return Object.defineProperty({
            trigger: event.trigger,
            subscribe: event.subscribe,
            push,
            remove
        } as unknown, 'entries', {
            get: function () {
                return getList()
            }
        }) as ReactiveList
    }

}

//TODO:doc
/**
 * 
 */
class StoreEvent<T> extends Event {
    constructor() {
        super('storeEvent')
    }
    trigger () {
        return dispatchEvent(this)
    }

    subscribe = (cb: (e: StoreEvent<T>) => void) => addEventListener(this.type, (e) => {
        if (e === this) cb(this)
    })

}
//TODO:doc
/**
 * 
 */
class ModelStack extends Array<typeof Model> {
    //TODO:not tested
    clear () {
        this.splice(0, this.length)
    }
    /**
     * get model from single name (class name)
     * @param name 
     * @returns 
     */
    findBySingular = (name: string | symbol | number): typeof Model | undefined => this.find(model => model.singularName === name)
    /**
     * get model from plural name (list name)
     * @param name 
     * @returns 
     */
    findByPlural = (name: string | symbol | number): typeof Model | undefined => this.find(model => model.pluralName === name)
    /**
     * Returns a corresponding singular to a plural property name
     * @param plural 
     * @returns 
     */
    toSingular = (plural: string | symbol | number) => this.findByPlural(plural)?.singularName
    /**
     * Returns a corresponding plural property name to a singular one
     * @param singular 
     * @returns 
     */
    toPlural = (singular: string | symbol | number) => this.findBySingular(singular)?.pluralName

    /**
     * True if property is foraign and key is stored on native(this) side.
     * @param propName 
     */
    isOneTo = <T extends Model> (propName: string | number | symbol): propName is keyof T => {
        return !!this.findBySingular(propName)
    }
    /**
     * True if property points at many foreign items. Keys are stored in foreign Items.
     * @param propName 
     */
    isToMany = (propName: string) => {
        return !!this.findByPlural(propName)
    }
    /**
     * True if property points at one foreign item. Key is stored on foreign side.
     * @param propName 
     */
    isToOne = (propName: string) => {
        const remove$ = propName.replace('$', '')
        if (remove$ === propName) return false
        return !!this.findBySingular(remove$)
    }
}


export {
    PairisStore,
    StoreEvent,
    ModelStack
}