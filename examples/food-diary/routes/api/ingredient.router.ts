import { Router } from '../../deps.ts'
import {
    Ingredient
} from '../../models/models.ts'

import {
    ingredientController
} from '../../controllers/ingredient.controller.ts'

const ingredients = new Router()

ingredients.get('/', ctx => {
    ctx.response.body = Ingredient.all()
})

ingredients.get('/:uid', ctx => {
    ctx.response.body = Ingredient.use(ctx.params.uid)
})

ingredients.post('/new', async ctx => {
    const {value} = ctx.request.body({ type: 'json' })
    const ingredient = await value
    ctx.response.body = ingredientController.new(ingredient)
})

const ingredientRouter = new Router().use('/ingredients', ingredients.routes(), ingredients.allowedMethods())

export { ingredientRouter }