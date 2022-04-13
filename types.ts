export type UUID = string

export interface Reactive<T> {
    value: T | undefined
    subscribe: (cb: (e: Event) => void) => void
    trigger: () => boolean
}
export type ReactiveItem = Reactive<any>
/**
 * 
 */
//export type Item<T> = Reactive<T>

//export type ItemList<T> = Record<string, Reactive<T>>

export type UseStoreMethod = <T>(key: string, def?: T) => Reactive<T>

export interface ItemWithUid<T> {
    uid: string,
    item: Reactive<T>
}

export type RemoveUid<T> = Omit<T, 'uid'>
/**
 * Represents an item modeled after \<T\>.   
 * This helper removes uid and all functions from type.
 */

//TODO: properties that are pointing to models must be recognized as UIDs.
export type ListItem<T> = RemoveUid<NonFunctionProperties<T>>
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export interface ReactiveList {
    trigger: () => void,
    subscribe: () => void,
    push: (val: string) => void,

    remove: (uid: string) => void,
    entries: []

}