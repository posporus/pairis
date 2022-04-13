import { NonFunctionProperties } from '../types.ts'
import { getProperty } from './getProperty.ts'
import { setProperty } from './setProperty.ts'
import { PairisStore } from './storage.ts'

//import { Store } from './store.ts'

export const store = new PairisStore()

class Model {

    uid!: string
    modelClass!: typeof Model

    subscribe!: (cb: (e: Event) => void) => void
    trigger!: () => boolean

    static list = '_'

    static store: PairisStore = store

    /**
     * Load an item with this model. If no uid is specified, a new item is generated.
     * @param uid 
     * @returns 
     */
    static use<T extends typeof Model> (this: T, uid?: string): InstanceType<typeof this> {

        const instance = this.invoke()

        if (uid) {
            instance.uid = uid
            return instance
        }
        const key = instance.uid

        this.store.useList(this.list).push(key)

        return instance

    }

    protected static invoke<T extends typeof Model> (this: T) {
        //new instance of model
        const instance = new this as InstanceType<T>
        instance.modelClass = this
        return proxy(instance, this.store)
        //map properties to instance

    }

    //TODO:
    static all<T extends typeof Model> (this: T): InstanceType<T>[] {
        const list = this.store.useList(this.list)
        return list.entries.map(uid => this.use(uid))
    }
    //TODO:
    static is<T extends typeof Model> (this: T, propertyName: keyof NonFunctionProperties<InstanceType<T>>, value: any) {
        return this.all<T>().filter(item => item[propertyName] === value)
    }
    //TODO:
    static where<T extends typeof Model> (this: T, propertyName: keyof NonFunctionProperties<InstanceType<T>>, value: any): InstanceType<T>[]
    static where<T extends typeof Model> (this: T, propertyName: keyof Model, value: any): InstanceType<T>[]
    static where<T extends typeof Model> (this: T, ...args: any[]) {
        const propertyName = args[0]
        const value = args[1]
        return this.is(propertyName, value)
    }



    set<T extends this> (props: Partial<NonFunctionProperties<T>>) {
        Object.assign(this, props)
        return this
    }

    /**
     * get model class name.
     * @returns 
     */
    model = () => {
        return this.constructor.name
    }

    /**
     * This method needs to be called after describing models to introduce them
     * to other models to make their relationships work. Not needed for models without
     * relationships.
     * @param this 
     */
    static introduce<T extends typeof Model> (this: T) {
        store.modelStack.push(this)
    }

    //TODO: user should be able to change singular and plural names
    /**
     * The property name of this model that is used for to-one or one-to relationships.
     * By default it is the class name of the model in lowercase.
     */
    static get singularName () {
        return this.name.toLowerCase() as keyof Model
    }
    /**
     * The property name of this model that is used for to-many relationships.
     * By default it is the list name of the model in lowercase.
     */
    static get pluralName () {
        return this.list.toLowerCase() as keyof Model
    }

    delete() {
        //delete stored item
        store.delete(this.uid)
        //remove from list
        const list  = store.useList(this.modelClass.list)
        list.remove(this.uid)
        //remove from foreign props
        //this.uid = undefined

    }

}

const proxy = <T extends typeof Model> (instance: InstanceType<T>, store: PairisStore) => {
    return new Proxy(instance, {
        get: (target, name) => getProperty<InstanceType<T>>(target, name as keyof InstanceType<T>, store),
        set: (target, name, value) => { return setProperty<InstanceType<T>>(target, name as keyof InstanceType<T>, value, store) }
    })
}

export {
    Model,
    proxy
}