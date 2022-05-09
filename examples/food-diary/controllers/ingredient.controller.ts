import {
    Ingredient
} from '../models/models.ts'

const ingredientController = {
    new: (data: Ingredient) => {
        const ingredient = Ingredient.use().set({ ...data })
        console.log(Ingredient.all())
        return ingredient
        
    }

}

export { ingredientController }