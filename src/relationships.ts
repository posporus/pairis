import {Model} from './Model.ts'
import {modelStack} from './modelStack.ts'


/**
 * True if property is Foraign and key is stored on native(this) side.
 * @param propName 
 */
const isOneTo =<T extends Model> (propName:string | number | symbol): propName is keyof T=>{
    return !!modelStack.findBySingular(propName)
}
/**
 * True if property points at many foreign items. Keys are stored in foreign Items.
 * @param propName 
 */
const isToMany  = (propName:string)=>{
    return !!modelStack.findByPlural(propName)
}
/**
 * True if property points at one foreign item. Key is stored on foreign side.
 * @param propName 
 */
const isToOne = (propName:string)=>{
    const remove$ = propName.replace('$','')
    if(remove$ === propName) return false
    return !!modelStack.findBySingular(remove$)
}

export {
    isOneTo,
    isToMany,
    isToOne
}