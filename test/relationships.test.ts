import { assertEquals, assert } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { v4 } from "https://deno.land/std@0.127.0/uuid/mod.ts"
import { Model, store } from '../src/Model.ts'
import { ListItem } from '../types.ts'

store.modelStack.clear()
//#Setting up some Models
class Dog extends Model {
    static list = 'dogs'
    name!: string
    breed!: string
    //Dog has one human (many-to-one)
    human!: Human
    //Dog has one home (many-to-one)
    home!: Home
}
Dog.introduce()

class Human extends Model {
    static list = 'humans'
    name!: string
    //Human has many dogs (one-to-many)
    dogs!: Dog[]
    //Human has one home (many-to-one)
    home!: Home
}
Human.introduce()

class Home extends Model {
    static list = 'homes'
    //Home has one address (one-to-one)
    address!: Address
    //Home has many dogs (one-to-many)
    dogs!: Dog[]
    //Home has many humans (one-to-many)
    humans!: Human[]

}
Home.introduce()

class Address extends Model {
    static list = 'addresses'
    street!: string
    number!: number
    zipcode!: string
    city!: string
    //Address has one home (one-to-one)
    $home!: Home
}
Address.introduce()
Deno.test({
    name: 'Determine relationships by name',

    async fn (t) {
        //clear models
        //models.clear()
        await t.step('"owner" should oneTo relationship', t => {
            const propName = 'human'
            assert(store.modelStack.isOneTo(propName))
            assert(!store.modelStack.isToMany(propName))
            assert(!store.modelStack.isToOne(propName))
        })
        await t.step('"dogs" should be toMany relationship', t => {
            const propName = 'dogs'
            assert(!store.modelStack.isOneTo(propName))
            assert(store.modelStack.isToMany(propName))
            assert(!store.modelStack.isToOne(propName))
        })
        await t.step('"owners" should be toMany relationship', t => {
            const propName = 'humans'
            assert(!store.modelStack.isOneTo(propName))
            assert(store.modelStack.isToMany(propName))
            assert(!store.modelStack.isToOne(propName))
        })
        await t.step('"$home" should be toOne relationship', t => {
            const propName = '$home'
            assert(!store.modelStack.isOneTo(propName))
            assert(!store.modelStack.isToMany(propName))
            assert(store.modelStack.isToOne(propName))
        })


    }
})

Deno.test({
    name: 'OneTo relationship',

    async fn (t) {

        //clear store
        store.clear()

        //Giving it some sample data
        const rex = Dog.use().set({
            name: 'Rex'
        })
        const luca = Human.use().set({
            name: 'Luca'
        })
        const peddy = Human.use().set({
            name: 'Peddy'
        })
        const house = Home.use()
        const anAddress = Address.use().set({
            street: 'Someroad',
            number: 4,
            city: 'Cooltown',
            zipcode: '89983'
        })

        //#Testing

        await t.step('set one-to (1) -  with object.property = *', t => {
            house.address = anAddress
            assertEquals(store.get<ListItem<Home>>(house.uid)?.address, anAddress.uid)
        })

        await t.step('get one-to (1)', t => {
            assertEquals(house.address.street, anAddress.street)
            assertEquals(house.address.number, anAddress.number)
            assertEquals(house.address.uid, anAddress.uid)
            assertEquals(house.address.city, anAddress.city)
        })

        await t.step('set one-to (2) - with set(*)', t => {
            peddy.set({
                home: house
            })
            assertEquals(store.get<ListItem<Human>>(peddy.uid)?.home, house.uid)
        })

        await t.step('get one-to (2)', t => {
            assertEquals(peddy.home.uid, house.uid)

        })

        await t.step('set one-to (3) -  with new item', t => {
            luca.home = Home.use()
            assert(v4.validate(store.get<{ home: string }>(luca.uid)?.home || ''))
        })

        await t.step('get one-to (3)', t => {
            assert(v4.validate(luca.home.uid))

        })

        await t.step('set one-to (4) - set value directly without invoking model', t => {
            rex.human.name = 'Jona'
            assertEquals(store.get<ListItem<Dog>>(rex.uid)?.human, rex.human.uid)
        })

    }
})

Deno.test({
    name: 'toMany relationship',

    async fn (t) {

        //clear store
        store.clear()

        //Giving it some sample data
        const hasso = Dog.use().set({
            name: 'Hasso'
        })

        const rex = Dog.use().set({
            name: 'Rex'
        })

        const lessi = Dog.use().set({
            name: 'Lessi'
        })

        const robin = Human.use().set({
            name: 'Robin'
        })
        const finn = Human.use().set({
            name: 'Finn'
        })

        //#Testing

        await t.step('set to-many (1) -  with object.property = *', t => {
            robin.dogs = [hasso]
            assertEquals(store.get<ListItem<Dog>>(hasso.uid)?.human, robin.uid)
        })

        await t.step('get to-many (1) from foreign model', t => {
            assertEquals(hasso.human.uid, robin.uid)
        })


        await t.step('get to-many (1) from this model', t => {
            //console.log('ROBIN DOGS',robin.dogs)
            assertEquals(robin.dogs[0].uid, hasso.uid)
        })

        await t.step('get to-many (1) from foreign model', t => {
            assertEquals(hasso.human.uid, robin.uid)
        })

        await t.step('set to-many (1) -  with object.set()', t => {
            finn.set({ dogs: [rex, lessi] })
            assertEquals(store.get<ListItem<Dog>>(rex.uid)?.human, finn.uid)
            assertEquals(store.get<ListItem<Dog>>(lessi.uid)?.human, finn.uid)
        })

        console.log(store.cache)

    }
})

Deno.test({
    name: 'toOne relationship',
    //only:true,

    async fn (t) {

        //clear store
        store.clear()

        //Giving it some sample data
        const milo = Dog.use().set({
            name: 'Milo'
        })
        const mika = Human.use().set({
            name: 'Mika'
        })
        const jona = Human.use().set({
            name: 'Jona'
        })
        const treeHouse = Home.use()//.set({})
        const niceAddress = Address.use().set({
            street: 'Someroad',
            number: 4,
            city: 'Cooltown',
            zipcode: '89983'
        })

        //#Testing

        await t.step('set to-one (1) -  with object.property = *', t => {
            niceAddress.$home = treeHouse
            assertEquals(store.get<ListItem<Home>>(treeHouse.uid)?.address, niceAddress.uid)
        })

        await t.step('get to-one (1) -  from this model', t => {
            assertEquals(niceAddress.$home.uid, treeHouse.uid)
        })
        await t.step('get to-one (1) -  from foreign model', t => {
            assertEquals(treeHouse.address.uid, niceAddress.uid)
        })



    }
})

