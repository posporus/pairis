import { StoredModel } from './stored.model.ts'
import { Amount } from './amount.model.ts'

export class Meal extends StoredModel {

    static list = 'meals'

    name!: string
    amounts?: Amount[]

    getFoodValues () {
        const values = {
            calories: 0,
            fat: 0,
            protein: 0,
            carbs: 0
        }

        const sum = this.amounts?.map(a => a.value).reduce((prev, cur) => prev + cur) || 0

        this.amounts?.map((amount) => {
            values.calories += amount.ingredient.calories * amount.value
            values.fat += amount.ingredient.fat * amount.value
            values.protein += amount.ingredient.fat * amount.value
            values.carbs += amount.ingredient.carbs * amount.value
        })

        return {
            calories: Math.round(values.calories/sum),
            fat: Math.round(values.fat/sum),
            protein: Math.round(values.protein/sum),
            carbs: Math.round(values.carbs/sum)
        }

    }

}

Meal.introduce()