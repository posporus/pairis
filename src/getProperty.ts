import { Model } from './Model.ts'
import { uuid } from './uid.ts'
import { PairisStore } from './storage.ts'
import type { ListItem } from '../types.ts'

/**
 * GETTER for property of model
 * @param target 
 * @param name 
 * @param store 
 * @returns 
 */
const getProperty = <T extends Model> (target: T, name: keyof T, store: PairisStore) => {

    if (name === 'uid')
        return target.uid || (target.uid = uuid())

    //this also generates a uid target has none.
    const uid = target.uid


    //is name of value [NOT] set? //return whole object
    //TODO: maybe not super safe :/
    if (typeof name !== 'string') {
        return target
    }


    const storedItem = store.use<ListItem<T>>(uid)

    //linking subscribe and trigger functions
    target.subscribe = storedItem.subscribe
    target.trigger = storedItem.trigger

    //get stored property if available
    const storedProp = storedItem.value && Object.hasOwn(storedItem.value, name)
        ? storedItem.value[name as keyof ListItem<T>] : undefined

    //is foreign(one)?
    //-> name = anyModelName.toLowercase()
    //in case is foreign + uid is stored
    if (store.modelStack.isOneTo(name)) {
        const foreignModel = store.modelStack.findBySingular(name)

        if (foreignModel && typeof storedProp !== 'undefined' && typeof storedProp === 'string')
            return foreignModel.use(storedProp)

        if (foreignModel && typeof storedProp === 'undefined') {
            //TODO: whatever nn means
            const nn = foreignModel.use()

            const temp = store.use<Record<string, unknown>>(uid)
            temp.value = {
                ...temp.value,
                [name]: nn.uid
            }

            return nn
        }

        return undefined

    }

    if (store.modelStack.isToMany(name)) {
        const singularPropName = target.modelClass.singularName
        const foreignModel = store.modelStack.findByPlural(name)

        if (singularPropName && foreignModel) {

            const lookups = store.lookup(foreignModel?.list, singularPropName, uid)

            if (lookups)
                return lookups.map(uid => foreignModel.use(uid))
        }
        return []
    }

    if (store.modelStack.isToOne(name)) {
        const remove$ = name.replace('$', '')
        const propName = target.modelClass.singularName
        const foreignModel = store.modelStack.findBySingular(remove$)

        if (propName && foreignModel) {
            const lookups = store.lookup(foreignModel?.list, propName, uid)
            if (lookups)
                return foreignModel.use(lookups[0])
        }
        return undefined

    }

    const instanceProp = target[name]

    return storedProp !== undefined ? storedProp : instanceProp

}


export {
    getProperty
}