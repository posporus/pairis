import { Model } from './Model.ts'
import { uuid } from './uid.ts'
import type { ListItem } from '../types.ts'
import { modelStack } from './modelStack.ts'
import { Store } from './store.ts'

import { isOneTo, isToMany, isToOne } from './relationships.ts'

const getProperty = <T extends Model> (target: T, name: keyof T, store: Store) => {

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
    if (isOneTo(name)) {
        const foreignModel = modelStack.findBySingular(name)
        //console.log('isOneTo', name, foreignModel?.name, storedProp)

        if (foreignModel && typeof storedProp !== 'undefined' && typeof storedProp === 'string')
            return foreignModel.use(storedProp)

        if (foreignModel && typeof storedProp === 'undefined') {
 
            const nn = foreignModel.use()
            //console.log(nn.uid)

            //console.log('target name:', target)

            if (store.update(uid, { [name]: nn.uid })) return nn

        }

        return undefined

    }

    if (isToMany(name)) {
        const singularPropName = target.modelClass.singularName
        const foreignModel = modelStack.findByPlural(name)

        if (singularPropName && foreignModel) {

            const lookups = store.lookup(foreignModel?.list, singularPropName, uid)

            if (lookups)
                return lookups.map(uid => foreignModel.use(uid))
        }
        return []
    }

    if (isToOne(name)) {
        const remove$ = name.replace('$', '')
        //console.log('isToOne', name, remove$, uid)
        const propName = target.modelClass.singularName
        const foreignModel = modelStack.findBySingular(remove$)

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


/**
 * figures out weather property has a foreign item or not.
 * @param property 
 * @returns 
 */

export {
    getProperty
}