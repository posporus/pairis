import { Model } from './Model.ts'
/* interface ModelProfile {
    model:typeof Model

} */
class ModelStack<T extends typeof Model> extends Array<T> {
    //TODO:not tested
    clear(){
        this.splice(0,this.length)
    }
}
export const models = new ModelStack

export const modelStack = {
    /**
     * push a model to stack
     * @param model 
     */
    add: (model: typeof Model) => {
        models.push(model)
    },
    /**
     * get model from single name (class name)
     * @param name 
     * @returns 
     */
    findBySingular: (name: string | symbol | number): typeof Model | undefined => models.find(model => model.singularName === name),
    /**
     * get model from plural name (list name)
     * @param name 
     * @returns 
     */
    findByPlural: (name: string | symbol | number): typeof Model | undefined => models.find(model => model.pluralName === name),
    /**
     * Returns a corresponding singular to a plural property name
     * @param plural 
     * @returns 
     */
    toSingular: (plural: string | symbol | number) => modelStack.findByPlural(plural)?.singularName,
    /**
     * Returns a corresponding plural property name to a singular one
     * @param singular 
     * @returns 
     */
    toPlural: (singular: string | symbol | number) => modelStack.findBySingular(singular)?.pluralName



}