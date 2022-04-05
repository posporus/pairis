import { Model } from './Model.ts'
//import { usePair } from './usePair.ts'
import type { Reactive, UseStoreMethod } from '../types.ts'
import { isOneTo, isToMany, isToOne } from './relationships.ts'
import { modelStack } from './modelStack.ts'
import { Store} from './store.ts'


/**
 *  b
 * @param target 
 * @param name 
 * @param value 
 * @returns 
 */
const setProperty = <T extends Model> (target: T, name: keyof T, value: any, store: Store) => {

    if (name === 'uid') {
        //TODO: maybe check if uid is valid?
        target.uid = value
        return true
    }

    if (typeof name !== 'string') {
        //console.error('SETTER: PROPERTYNAME IS NO STRING')
        return false
    }

    const uid = target.uid

    const item = store.use<Record<string, unknown>>(uid)

    if (isOneTo(name)) {
        const foreignObject = isModel(value) ? value : (modelStack.findBySingular(name) || Model).use().set(value)

        updateItem(item, {
            [name]: foreignObject.uid
        })
        return true
    }

    if (isToMany(name)) {

        const foreignPropName = target.modelClass.singularName

        if (Array.isArray(value))
            //iterate value
            value.forEach(foreignVal => {
            
                foreignVal[foreignPropName] = target

            })
        return true
        

    }
    if (isToOne(name)) {

        const foreignPropName = target.modelClass.singularName

        value[foreignPropName] = target
        
        return true
    }
    
    updateItem(item, {
        [name]: value
    })

    return true

}


const isModel = (model: any): model is Model => model instanceof Model




const updateItem = <T> (item: Reactive<T>, values: Partial<T>) => {
    item.trigger()
    item.value = {
        ...item.value,
        ...values
    }
    return item
}


export {
    setProperty
}