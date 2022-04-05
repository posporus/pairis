import { reactive } from './reactive.ts'
import type { Reactive } from './reactive.ts'
import { ReactiveItem } from '../types.ts'
export const store = new Map<string, ReactiveItem>()
/**
 * Stores key:Reactive<value> pairs in store as Map. 
 * Returns Reactive with value T.
 * Creates pair if it doesn't exist.
 * @param key key
 * @param def default value \<T\>
 * @returns Reactive\<T\>
 */
const usePair = <T extends Record<string, unknown> | unknown> (key: string, def: T | null = null): Reactive<T> => {
    if(!key) throw new Error('key is undefined.')
    if (!store.has(key)) store.set(key, reactive(def))
    return store.get(key) as Reactive<T>
}

export { usePair }
