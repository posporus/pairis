import { Router } from '../../deps.ts'
import {
    Meal
} from '../../models/models.ts'

import {
    MealController
} from '../../controllers/meal.controller.ts'

const meals = new Router()

const mealController = new MealController()

meals.get('/', ctx => {
    ctx.response.body = mealController.getMealList()
})

meals.get('/:uid', ctx => {
    ctx.response.body = mealController.getMealListEntry(ctx.params.uid)
})

meals.post('/new', async ctx => {
    const {value} = ctx.request.body({ type: 'json' })
    const meal = await value
    ctx.response.body = mealController.new(meal)
})

const mealRouter = new Router().use('/meals', meals.routes(), meals.allowedMethods())

export { mealRouter }