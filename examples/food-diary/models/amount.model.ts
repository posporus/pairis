import { StoredModel } from './stored.model.ts'
import { Ingredient } from './ingredient.model.ts'

export class Amount extends StoredModel {

    static list = 'amounts'

    ingredient!: Ingredient
    value!: number
    
}
Amount.introduce()