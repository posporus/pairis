import {
    assertArrayIncludes,
    assertEquals,
} from "https://deno.land/std@0.77.0/testing/asserts.ts";

import { reactive } from '../src/reactive.ts'
import type { Reactive } from '../src/reactive.ts'

import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';


Deno.test("basic reactive", async t => {
    let myReactive: Reactive<string>

    await t.step('set value', () => {
        myReactive = reactive('hello world')
        assertEquals(myReactive.value, 'hello world');
    })

    await t.step('change value', () => {
        myReactive.value = 'foo'
        assertEquals(myReactive.value, 'foo');
    })

    await t.step('change value after 200ms', async () => {
        self.setTimeout(() => {
            myReactive.value = 'bar'
        }, 200)
        assertEquals(myReactive.value, 'foo')
    
        await (() => new Promise(resolve => {
            myReactive.subscribe((e) => {
                resolve(e)
            })
        }))()
        assertEquals(myReactive.value, 'bar');
    })


})



Deno.test("set values of same reactive with different objects", async (t) => {

    const r = reactive(null as any)

    const val1 = 'string'
    const val2 = null
    const val3 = undefined
    const val4 = {
        objKey: 'string',
        count: 3
    }
    const val5 = [1, 2, 3, 4]
    const val6 = [val1, val2, val3, val4, val5]

    await t.step('string', () => {
        r.value = val1
        assertEquals(r.value, val1)
    })
    await t.step('null', () => {
        r.value = val2
        assertEquals(r.value, val2)
    })
    await t.step('undefined', () => {
        r.value = val3
        assertEquals(r.value, val3)
    })
    await t.step('object', () => {
        r.value = val4
        assertEquals(r.value, val4)
    })
    await t.step('simple array', () => {
        r.value = val5
        assertEquals(r.value, val5)
    })
    await t.step('complex array', () => {
        r.value = val6
        assertEquals(r.value, val6)
    })
    await t.step('null again', () => {
        r.value = val2
        assertEquals(r.value, val2)
    })
    await t.step('object again', () => {
        r.value = val4
        assertEquals(r.value, val4)
    })
    await t.step('undefined again', () => {
        r.value = val3
        assertEquals(r.value, val3)
    })
    await t.step('complex array again', () => {
        r.value = val6
        assertEquals(r.value, val6)
    })

})

Deno.test("store inside Map", async (t) => {

    const map: Map<string, Reactive<any>> = new Map()
    const r = reactive('testValue')

    await t.step('save Reactive to Map', () => {
        map.set('testKey', r)
        assertEquals(map.size, 1)
    })

    await t.step('retrieve Reactive from Map', () => {
        const gotR = map.get('testKey')
        assertEquals(gotR?.value, 'testValue')
    })

    await t.step('override value retrieved from map', () => {
        const gotR = map.get('testKey')
        if (gotR) gotR.value = 'testValue2'
        assertEquals(gotR?.value, 'testValue2')
    })
    await t.step('retrieve overwritten value from map', () => {
        const gotR = map.get('testKey')
        assertEquals(gotR?.value, 'testValue2')
    })

})

/* Deno.test("store inside map with delay", async (t) => {
    const map: Map<string, Reactive<any>> = new Map()

    await t.step('set reactive value', () => {
        const r = reactive('testValue')
        map.set('testKey2', r)
        assertEquals(map.size, 1)
    })

    //await delay(200)

    await t.step('change value after 200ms', async () => {
        const gotR = map.get('testKey2')
        self.setTimeout(() => {
            if (gotR) gotR.value = 'testValue2'
            
        }, 200)
        assertEquals(gotR?.value, 'testValue2')
    
        await (() => new Promise(resolve => {
            gotR?.subscribe((e) => {
                resolve(e)
            })
            assertEquals(gotR?.value, 'testValue2');
        }))()
    })

    

}) */