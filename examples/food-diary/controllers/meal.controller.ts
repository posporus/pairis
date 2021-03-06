import {
    Controller,
    Get,
    Post,
    Param,
    Body
} from '../deps.ts'

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

/* const getMeal = (uid:string):GetMeal => {
    const meal = Meal.use(uid)
    return {
        name :meal.name,
        foodValues : meal.getFoodValues()
    }
}
const getMealList = () =>  {
    const meals = Meal.all()
    return meals.map(m=>getMeal(m.uid))
} */


@Controller('/meal')
export class MealController {

    @Get('/')
    getMealList (): GetMeal[] {
        const meals = Meal.all()
        return meals.map(m => this.getMealListEntry(m.uid))
    }


    @Get('/:uid')
    getMealListEntry (@Param("uid") uid: string,) {
        const meal = Meal.use(uid)
        return {
            uid: meal.uid,
            name: meal.name,
            foodValues: meal.getFoodValues()
        }
    }

    @Post("/new")
    post (@Body() data: PostMeal) {

        console.log(data)
        const amounts: Amount[] = data.amounts?.map(amount => Amount.use().set({ value: amount.value, ingredient: Ingredient.use(amount.ingredient) }))
        const meal = Meal.use().set({ name: data.name, amounts })
        return this.getMealListEntry(meal.uid)
    }
}