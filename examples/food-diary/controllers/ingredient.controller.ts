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

@Controller('/ingredient')
export class IngredientController {

    @Get('/')
    test () {
        return Ingredient.all();
    }

    @Get('/:uid')
    json (@Param("uid") uid: string,) {
        return Ingredient.use(uid);
    }

    @Post("/new")
    post (@Body() data: Ingredient) {
        const ingredient = Ingredient.use().set({ ...data })
        console.log(Ingredient.all())
        return {
            ingredient,
        };
    }
}