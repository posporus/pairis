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

@Controller('/meal')
export class MealController {

    @Get('/')
    test () {
        return Meal.all();
    }

    @Get('/:uid')
    json (@Param("uid") uid: string,) {
        return Meal.use(uid);
    }
    
    @Post("/new")
    post (@Body() data: Meal) {

        console.log(data)
        const meal = Meal.use().set({ ...data })
        return {
            meal,
        };
    }
}