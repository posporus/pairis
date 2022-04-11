import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { PairisStore } from '../src/storage.ts'

Deno.test("useList", async t => {

    const store = new PairisStore()

    await t.step('using a list => store.cache.size should be 1', () => {
        store.useList('people')
        assertEquals(store.cache.size, 1)
    })

    await t.step('using a list => store.cache.size should still be 1', () => {
        store.useList('people')
        assertEquals(store.cache.size, 1)
    })

    await t.step('pushing string to list => retrieving with get', () => {
        const list = store.useList('people')
        list.push('chris')
        assertEquals(store.get('people'), ['chris'])
    })

    await t.step('only retrieving with get', () => {
        assertEquals(store.get('people'), ['chris'])
    })

    await t.step('only retrieving list.entries', () => {
        const list = store.useList('people')
        assertEquals(list.entries, ['chris'])
    })

    await t.step('using map on list.entries', () => {
        const list = store.useList('people')
        const mapped = list.entries.map(() => 'overwritten')
        assertEquals(mapped, ['overwritten'])
    })

    await t.step('pushing some more => lenght should be 4', () => {
        const list = store.useList('people')
        list.push('kay')
        list.push('adrian')
        list.push('benja')
        assertEquals(list.entries.length, 4)
    })


})

Deno.test("useList", async t => {

    const store = new PairisStore(sessionStorage)

    await t.step('using a list => sessionStorage.length should be 1', () => {
        store.useList('people')
        assertEquals(sessionStorage.length, 1)
    })

    await t.step('using a list => sessionStorage.length should be 1', () => {
        const list = store.useList('people')
        list.push('key1')
        assertEquals(sessionStorage.length, 1)
    })

})