/* import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";

import { Model, persist, PairisStore } from '../mod.ts'

Deno.test({
    name: "full functional test",

    async fn (t) {
        const store = new PairisStore()

        @persist(store)
        class Meal extends Model {
            //static store = store
            static list = 'meals'
            name!: string
            amounts?: Amount[]
            
            public get calories() : number {
                console.log('calories ab', this.amounts)
                let calories = 0
                this.amounts?.forEach((amount) => {
                    console.log('amount',amount)
                    calories += amount.ingredient.calories
                })
                return calories
            }

            getCalories() {
                let calories = 0
                this.amounts?.forEach((amount) => {
                    //console.log('amount',amount)
                    calories += amount.ingredient.calories
                })
                return calories
            }
            
        }
        Meal.introduce()

        @persist(store)
        class Ingredient extends Model {
            static list = 'ingredients'
            name!: string
            calories!: number
            fat!: number
            protein!: number
            carb!: number
        }
        Ingredient.introduce()

        @persist(store)
        class Amount extends Model {
            static list = 'amounts'
            ingredient!: Ingredient
            value!: number
        }
        Amount.introduce()

        //  #Testing
        await t.step('mock', t => {
            const flour = Ingredient.use().set({
                name: 'Flour',
                calories: 348,
                protein: 10,
                fat: 1,
                carb: 73.3

            })
            const egg = Ingredient.use().set({
                name: 'Egg',
                calories: 137,
                protein: 11.8,
                fat: 9.3,
                carb: 1.5
            })
            const milk = Ingredient.use().set({
                name: 'Milk',
                calories: 64,
                protein: 3.5,
                fat: 3.5,
                carb: 4.7
            })
            
            const pancake = Meal.use().set({
                name: 'Pancake',
                amounts: [
                    Amount.use().set({
                        ingredient: flour,
                        value: 10
                    }),
                    Amount.use().set({
                        ingredient: egg,
                        value: 63
                    }),
                    Amount.use().set({
                        ingredient: milk,
                        value: 110
                    })
                ]
            })
            //meal.amounts = [amount1]
            console.log(store.cache)
            console.log('pancake calories', pancake.getCalories())
            
        })
    }
})
 */