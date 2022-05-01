import {
    Area
} from '../deps.ts'
import { MealController } from '../controllers/meal.controller.ts'
import { IngredientController } from '../controllers/ingredient.controller.ts'

@Area({
    controllers: [MealController,IngredientController],
})
export class ApiArea { }