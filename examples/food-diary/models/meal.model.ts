import { StoredModel } from './stored.model.ts'
import { Amount } from './amount.model.ts'

export class Meal extends StoredModel {

    static list = 'meals'

    name!: string
    amounts?: Amount[]

}

Meal.introduce()