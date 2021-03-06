import { assertEquals, assert } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { v4 } from "https://deno.land/std@0.127.0/uuid/mod.ts"
import { Model, store } from '../src/Model.ts'

import { ListItem } from '../types.ts'


Deno.test({
    name: "simple animal model",
    async fn (t) {
        store.clear()

        class Animal extends Model {
            static list = 'animals'
            name!: string
            legs = 4
            position = 5

            walk () {
                this.position++
            }

        }

        //  #Testing
        await t.step('set single property', t => {
            const cow = Animal.use()
            cow.name = 'cow'
            assertEquals(cow.legs, 4)
            assertEquals(cow.name, 'cow')
        })

        await t.step('sample check: store["animals"] should have 1 items', t => {
            assertEquals(store.get<string[]>('animals')?.length, 1)
        })

        await t.step('change standard property', t => {
            const penguin = Animal.use()
            penguin.name = 'penguin'
            penguin.legs = 2

            assertEquals(penguin.legs, 2)
            assertEquals(penguin.name, 'penguin')
        })

        await t.step('change standard property to 0', t => {
            const snake = Animal.use()
            snake.name = 'snake'
            snake.legs = 0

            assertEquals(snake.legs, 0)
            assertEquals(snake.name, 'snake')
        })

        await t.step('set single property another way', t => {
            const fish = Animal.use()
            fish['name'] = 'fish'
            fish.legs = 0

            assertEquals(fish.name, 'fish')
            assertEquals(fish.legs, 0)
        })

        await t.step('set property with set()', async t => {
            const bird = Animal.use().set({ name: 'bird', legs: 2 })

            await t.step('should have right properties', t => {
                assertEquals(bird.legs, 2)
                assertEquals(bird.name, 'bird')
            })

            await t.step('should also be in store', t => {
                assertEquals(store.get<ListItem<Animal>>(bird.uid)?.name, 'bird')
            })

        })

        await t.step('custom method', t => {
            const dog = Animal.use().set({ name: 'dog' })
            dog.walk()
            assertEquals(dog.position, 6)

        })

        await t.step('store should have key animals as array', t => {
            assert(Array.isArray(store.get('animals')))

        })

        await t.step('animals list should have 6 entrys', t => {
            assertEquals(store.get<string[]>('animals')?.length, 6)
        })


        await t.step('animals[1]', async t => {
            const animals = store.get<string[]>('animals')
            const uuid = animals ? animals[1] : ''
            await t.step('animals[1] should be valid uuid v4', t => {
                assert(v4.validate(uuid))
            })

            const item = store.get<ListItem<Animal>>(uuid)
            await t.step('there should be an item with that uuid', t => {
                assert(item)
            })
            await t.step('that item should have a name', t => {
                assert(item?.name)
            })
        })

    }

})
Deno.test({
    name: "set()",

    async fn (t) {

        store.clear()

        class Tool extends Model {
            static list = 'tools'
            name!: string
            purpose!: string
        }

        //  #Testing
        await t.step('set ', t => {
            const hammer = Tool.use().set({ name: 'hammer', purpose: 'nailing' })
            assertEquals(store.get<ListItem<Tool>>(hammer.uid)?.name, 'hammer')

        })

    }
})

Deno.test({
    name: "methods()",

    async fn (t) {

        store.clear()

        const plants = [{
            "name": "Alder",
            "species": "Alnus"
        },
        {
            "name": "Black alder",
            "species": "Alnus glutinosa, Ilex verticillata"
        },
        {
            "name": "Common alder",
            "species": "Alnus glutinosa"
        },
        {
            "name": "False alder",
            "species": "Ilex verticillata"
        },
        {
            "name": "Gray alder",
            "species": "Alnus incana"
        }]

        class Plant extends Model {
            static list = 'plants'
            name!: string
            species!: string
        }

        //  #Testing
        await t.step('creating plants ', t => {
            plants.forEach(plant => {
                Plant.use().set(plant)
            })
            assertEquals(store.get<string[]>('plants')?.length, plants.length)
        })

        await t.step('sample check: store["plants"] should have 5 items', t => {
            assertEquals(store.get<string[]>('plants')?.length, 5)
        })

        await t.step('retrieving plants with all()', t => {
            assertEquals(Plant.all().map(plant => ({ name: plant.name, species: plant.species })), plants)
        })

        await t.step('sample check: store["plants"] should have 5 items', t => {
            assertEquals(store.get<string[]>('plants')?.length, 5)
        })

        await t.step('retrieving plant(s) with where() (1) targeting 1 entry', t => {
            assertEquals(Plant.where('name', 'Common alder').map(plant => ({ name: plant.name, species: plant.species }))[0], plants[2])
        })

        await t.step('retrieving plant(s) with where() (2) targeting 1 entry', t => {
            assertEquals(Plant.where('species', 'Alnus incana').map(plant => ({ name: plant.name, species: plant.species }))[0], plants[4])
        })

        await t.step('retrieving plant(s) with where() (3) targeting 0 entries', t => {
            assertEquals(Plant.where('species', 'Hemp').map(plant => ({ name: plant.name, species: plant.species }))[0], undefined)
        })

        await t.step('sample check: store["plants"] should have 5 items', t => {
            assertEquals(store.get<string[]>('plants')?.length, 5)
        })

    }
})



Deno.test({
    name: "models with simple (hasOne) relationship",

    async fn (t) {
        store.clear()

        enum VehicleType { BIKE, CAR, AIRPLANE, MOTORCYCLE }
        class Vehicle extends Model {
            static list = 'vehicles'
            brand!: string
            type!: VehicleType
            position = 5
            height = 0

            driver !: Driver

            drive () {
                this.position++
            }

            fly () {
                if (this.type === VehicleType.AIRPLANE) this.height++
            }

        }
        Vehicle.introduce()


        class Driver extends Model {
            static list = 'drivers'
            name!: string
        }
        Driver.introduce()

        //  #Testing
        await t.step('new vehicle and set foreign driver', t => {
            const a8 = Vehicle.use().set({ brand: 'Audi', type: VehicleType.CAR })
            a8.driver.name = 'Sasha'
            assertEquals(a8.brand, 'Audi')
            assertEquals(a8.driver.name, 'Sasha')

        })

         await t.step('new vehicle and set foreign driver', t => {
             const vw = Vehicle.use().set({ brand: 'VW', type: VehicleType.CAR })
             const noah = Driver.use().set({ name: 'noah' })
             vw.driver = noah
             assertEquals(vw.brand, 'VW')
             assertEquals(vw.driver.name, 'noah')
 
         })

    }
})

Deno.test({
    name: "models with simple (hasMany) relationship",

    async fn (t) {
        store.clear()

        //Things are made of materials
        class WG extends Model {
            static list = 'wgs'
            name!: string
            street!: string
            flatmates!: Flatmate[]
        }
        WG.introduce()
        class Flatmate extends Model {
            static list = 'flatmates'
            name!: string
            wg!: Flatmate | undefined
        }
        Flatmate.introduce()

        const flatmates = [
            Flatmate.use().set({ name: 'Mika' }),
            Flatmate.use().set({ name: 'Jona' }),
            Flatmate.use().set({ name: 'Yuki' })
        ]


        const wg = WG.use().set({ name: 'Chaos', street: 'Eternety Street 42', flatmates })

        //  #Testing
        await t.step('wg shoud have 3 flatmates', t => {

            assertEquals(wg.flatmates.length, 3)

        })
        await t.step('flatmates[0] should have a wg "Chaos"', t => {

            assertEquals(flatmates[0].wg?.name, 'Chaos')

        })
        
    }
})