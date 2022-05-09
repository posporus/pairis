import {
    Meal,
    Ingredient,
    Amount
} from '../models/models.ts'

interface PostMeal {
    name: string,
    amounts: { value: number, ingredient: string }[]
}

interface GetMeal {
    name: string
    foodValues: {
        calories: number
        fat: number
        protein: number
        carbs: number
    }
}

export class MealController {

    getMealList (): GetMeal[] {
        const meals = Meal.all()
        return meals.map(m => this.getMealListEntry(m.uid))
    }

    getMealListEntry (uid: string,) {
        const meal = Meal.use(uid)
        return {
            uid: meal.uid,
            name: meal.name,
            foodValues: meal.getFoodValues()
        }
    }

    new (data: PostMeal) {
        console.log(data)
        const amounts: Amount[] = data.amounts?.map(amount => Amount.use().set({ value: amount.value, ingredient: Ingredient.use(amount.ingredient) }))
        const meal = Meal.use().set({ name: data.name, amounts })
        return this.getMealListEntry(meal.uid)
    }
}

/* import {
    Meal,
    Ingredient,
    Amount
} from '../models/models.ts'

const mealController = {
    new: (data:Meal) => {
        const meal = Meal.use().set({...data})
        return {
            meal
        }
    }
} */