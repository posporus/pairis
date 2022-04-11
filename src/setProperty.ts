import { Model } from './Model.ts'
import { PairisStore } from './storage.ts'

/**
 * SETTER for property of model
 * @param target 
 * @param name 
 * @param value 
 * @returns 
 */
//TODO: value shouldn't be any
const setProperty = <T extends Model> (target: T, name: keyof T, value: any, store: PairisStore) => {

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

    if (store.modelStack.isOneTo(name)) {
        const foreignObject = isModel(value) ? value : (store.modelStack.findBySingular(name) || Model).use().set(value)

        item.value = {
            ...item.value,
            [name]: foreignObject.uid
        }
       
        return true
    }

    if (store.modelStack.isToMany(name)) {

        const foreignPropName = target.modelClass.singularName

        if (Array.isArray(value))
            //iterate value
            value.forEach(foreignVal => {
            
                foreignVal[foreignPropName] = target

            })
        return true 

    }
    if (store.modelStack.isToOne(name)) {

        const foreignPropName = target.modelClass.singularName

        value[foreignPropName] = target
        
        return true
    }

    item.value = {
        ...item.value,
        [name]: value
    }

    return true

}

const isModel = (model: any): model is Model => model instanceof Model

export {
    setProperty
}