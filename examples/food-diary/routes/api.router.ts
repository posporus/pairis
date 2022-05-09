import {
    Router
} from '../deps.ts'
import { ingredientRouter } from './api/ingredient.router.ts'
import { mealRouter } from './api/meal.router.ts'

const apiRouter = new Router()
apiRouter.use('/api', ingredientRouter.routes(),ingredientRouter.allowedMethods())
apiRouter.use('/api', mealRouter.routes(),mealRouter.allowedMethods())

export { apiRouter }