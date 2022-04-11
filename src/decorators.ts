import { PairisStore } from './storage.ts'
/**
 * Decorator to enable presistence on a Model.
 * @param store 
 * @returns 
 */
const persist = (store: PairisStore) => (target: any) => {
    target.store = store
    return target
}

export {
    persist
}