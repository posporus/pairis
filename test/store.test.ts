import {
    assertEquals,
    assert
} from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { Store } from '../src/store.ts'



import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';



Deno.test("Store non-persistent basic",

    async (t) => {
        //  #Setup
        const store = new Store()

        const testKey = 'thisIsAKeyKey'
        const testObject = {
            hello: 'world'
        }

        //  #Testing
        await t.step('store.set', t => {
            store.set(testKey, testObject)
            assertEquals(store.get(testKey)?.value, testObject)
        })

        await t.step('store.get', t => {
            const gotItem = store.get(testKey)
            assertEquals(gotItem.value, testObject)
        })

        await t.step('store.get and change value', t => {
            const gotItem = store.get(testKey)
            gotItem.value = 'string'
            assertEquals(gotItem.value, 'string')
        })

        await t.step('retrieve changed store.get', t => {
            const gotItem = store.get(testKey)

            assertEquals(gotItem.value, 'string')
        })

    }
)

Deno.test("store.set to null",
    (t) => {
        //  #Setup
        const store = new Store()

        const testKey = 'keykey'

        //  #Testing
        const reactive = store.set(testKey, null)
        assertEquals(reactive?.value, null)


    }
)
Deno.test("store.set to undefined",
    (t) => {
        //  #Setup
        const store = new Store()

        const testKey = 'keykey'

        //  #Testing
        const reactive = store.set(testKey, undefined)
        assertEquals(reactive?.value, undefined)

    }
)

Deno.test("set multiple times with the same key", async t => {
    //  #Setup

    const store = new Store()

    const testKey = 'thisIsAKey'
    const testObject1 = {
        hello: 'world'
    }
    const testObject1_2 = {
        hello: 'earth'
    }
    const testObject2 = {
        planet: 'jupiter'
    }
    const testObject3 = {
        name: 'mars',
        sweetness: 9
    }

    //  #Testing
    await t.step(`hello: world`, t => {
        store.set('testKey', testObject1)
        assertEquals(store.get('testKey')?.value, testObject1)
    })

    await t.step(`hello: earth`, t => {
        store.set('testKey', testObject1_2)
        assertEquals(store.get('testKey')?.value, testObject1_2)
    })

    await t.step(`planet: jupiter`, t => {
        store.set(testKey, testObject2)
        assertEquals(store.get(testKey)?.value, testObject2)
    })

    await t.step(`hello: world again`, t => {
        store.set(testKey, testObject1)
        assertEquals(store.get(testKey)?.value, testObject1)
    })

    await t.step(`chocolate bar: mars`, t => {
        store.set(testKey, testObject3)
        assertEquals(store.get(testKey)?.value, testObject3)
    })

    await t.step(`undefined`, t => {
        store.set(testKey, undefined)
        assertEquals(store.get(testKey)?.value, undefined)
    })

    await t.step(`hello: world again`, t => {
        store.set(testKey, testObject1)
        assertEquals(store.get(testKey)?.value, testObject1)
    })

    await t.step(`null`, t => {
        store.set(testKey, null)
        assertEquals(store.get(testKey)?.value, null)
    })

    await t.step(`name: mars again`, t => {
        store.set(testKey, testObject3)
        assertEquals(store.get(testKey)?.value, testObject3)
    })

}
)

Deno.test("Store use async",
    async (t) => {
        //  #Setup
        const store = new Store()

        const testKey = 'keykey'
        const testObject = {
            example: 'testtest',
            name: 'ash'
        }

        const r = store.use(testKey)
        //  #Testing
        await t.step('store.set', t => {
            const reactive = store.use(testKey)
            reactive.value = testObject
            assertEquals(reactive?.value, testObject)
        })

    }
)

Deno.test("Lookup",
    async (t) => {
        //  #Setup
        const store = new Store()

        const testKey = 'keykey'
        const testObject = {
            example: 'testtest',
            name: 'ash'
        }

        const r = store.use(testKey)
        //  #Testing
        await t.step('lookup', t => {
            const reactive = store.use(testKey)
            reactive.value = testObject
            assertEquals(reactive?.value, testObject)
        })

    }
)