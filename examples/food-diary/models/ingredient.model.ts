import { StoredModel } from './stored.model.ts'

export class Ingredient extends StoredModel {

    static list = 'ingredients'

    name!: string
    calories!: number
    fat!: number
    protein!: number
    carbs!: number
    density = 1
    liquid = false
    
}
Ingredient.introduce()