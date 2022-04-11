import { assertEquals, } from 'https://deno.land/std@0.77.0/testing/asserts.ts';
import { PairisStore } from '../src/storage.ts'

Deno.test('Basic PairisStore functionality with build-in cache', async t => {

    const store = new PairisStore()

    await t.step('set() string and retrieving from cache', () => {
        const key = 'fancyKey1'
        const val = 'this is a string'
        store.set(key, val)
        const result = store.cache.get(key)
        assertEquals(result, val)
    })

    await t.step('set() number and retrieving from cache', () => {
        const key = 'fancyKey2'
        const val = 8
        store.set(key, val)
        const result = store.cache.get(key)
        assertEquals(result, val)
    })

    await t.step('set() object and retrieving from cache', () => {
        const key = 'fancyKey3'
        const val = {
            hello: 'worl',
            missing: 't',
            true: false,
            funny: 0.6
        }
        store.set(key, val)
        const result = store.cache.get(key)
        assertEquals(result, val)
    })

    await t.step('set() array and retrieving from cache', () => {
        const key = 'fancyKey4'
        const val = ['string', 0, 99, { planet: 'earth', moons: 1 }]
        store.set(key, val)
        const result = store.cache.get(key)
        assertEquals(result, val)
    })

})

Deno.test('Set Cache manually', async t => {

    const store = new PairisStore()

    await t.step('setting string and retrieving with get()', () => {
        const key = 'fancyKey1'
        const val = 'this is a string'
        store.cache.set(key, val)
        const result = store.get(key)
        assertEquals(result, val)
    })

    await t.step('setting number and retrieving with get()', () => {
        const key = 'fancyKey2'
        const val = 8
        store.cache.set(key, val)
        const result = store.get(key)
        assertEquals(result, val)
    })

    await t.step('setting object and retrieving with get()', () => {
        const key = 'fancyKey3'
        const val = {
            hello: 'worl',
            missing: 't',
            true: false,
            funny: 0.6
        }
        store.cache.set(key, val)
        const result = store.get(key)
        assertEquals(result, val)
    })

    await t.step('setting array manually and retrieving with get()', () => {
        const key = 'fancyKey4'
        const val = ['string', 0, 99, { planet: 'earth', moons: 1 }]
        store.cache.set(key, val)
        const result = store.get(key)
        assertEquals(result, val)
    })

    await t.step('cache.size should be 4', () => {
        assertEquals(store.cache.size, 4)
    })

    await t.step('store.clear() => cache.size should be 0', () => {
        store.clear()
        assertEquals(store.cache.size, 0)
    })

})

Deno.test("PairisStore with sessionStorage", async t => {

    const store = new PairisStore(sessionStorage)
    store.clear()

    await t.step('set() string', () => {
        const key = 'fancyKey1'
        const val = 'this is a string'
        store.set(key, val)
        const result = JSON.parse(sessionStorage.getItem(key) || '')
        assertEquals(result, val)
    })

    await t.step('set() number', () => {
        const key = 'fancyKey2'
        const val = 8
        store.set(key, val)
        const result = JSON.parse(sessionStorage.getItem(key) || '')
        assertEquals(result, val)
    })

    await t.step('set() object', () => {
        const key = 'fancyKey3'
        const val = {
            hello: 'worl',
            missing: 't',
            true: false,
            funny: 0.6
        }
        store.set(key, val)
        const result = JSON.parse(sessionStorage.getItem(key) || '')
        assertEquals(result, val)
    })

    await t.step('set() array', () => {
        const key = 'fancyKey4'
        const val = ['string', 0, 99, { planet: 'earth', moons: 1 }]
        store.set(key, val)
        const result = JSON.parse(sessionStorage.getItem(key) || '')
        assertEquals(result, val)
    })

    await t.step('sessionStorage.lenght should be 4', () => {
        assertEquals(sessionStorage.length, 4)
    })
    await t.step('store.clear() => sessionStorage.lenght should be 0', () => {
        store.clear()
        assertEquals(sessionStorage.length, 0)
    })

})

Deno.test("get() with and without sessionStorage", async t => {

    const store = new PairisStore(sessionStorage)
    store.clear()

    await t.step('should be undefined', () => {
        assertEquals(store.get('yalla'), undefined)
    })

    await t.step('should be undefined', () => {
        assertEquals(store.get('yalla'), undefined)
    })

    await t.step('get with empty cache and sessionStorage', async (t) => {
        const key = 'testKey1'
        const val = 'stringeling'
        await t.step('sessionStorage.setItem()', () => {
            sessionStorage.setItem(key, JSON.stringify(val))
            assertEquals(JSON.parse(sessionStorage.getItem(key) || ''), val)
        })
        await t.step('cache.get() should be undefined', () => {
            assertEquals(store.cache.get(key), undefined)
        })
        await t.step('get should result in val', () => {
            assertEquals(store.get(key), val)
        })
        await t.step('cache.get should result in val', () => {
            assertEquals(store.cache.get(key), val)
        })
    })


})

Deno.test("use()", async t => {

    const store = new PairisStore()
    store.clear()

    await t.step('store.cache should be 0', () => {
        assertEquals(store.cache.size, 0)
    })

    await t.step('use() => store.cache should be 0', () => {
        store.use('yallaKey')
        assertEquals(store.cache.size, 0)
    })

    await t.step('set value => store.cache should be 1', () => {
        const dingsy = store.use('yallaKey')
        dingsy.value = 'hahaha'
        assertEquals(store.cache.size, 1)
    })
   
})

Deno.test("lookup()", async t => {

    const store = new PairisStore()
    store.clear()

    await t.step('setting some values and a list', () => {
        store.set('key1', { hello: 'earth' })
        store.set('key2', { hello: 'mars' })
        store.set('key3', { hello: 'jupiter' })
        store.set('key4', { hello: 'venus' })
        store.set('planets', ['key1', 'key2', 'key3', 'key4'])
        assertEquals(store.cache.size, 5)
    })

    await t.step('lookup jupiter', () => {
        const lookups = store.lookup('planets', 'hello', 'venus')
        assertEquals(lookups[0], 'key4')
    })

    await t.step('lookup mars', () => {
        const lookups = store.lookup('planets', 'hello', 'mars')
        assertEquals(lookups[0], 'key2')
    })

    await t.step('lookup uranus => should be undefined', () => {
        const lookups = store.lookup('planets', 'hello', 'uranus')
        assertEquals(lookups[0], undefined)
    })
})