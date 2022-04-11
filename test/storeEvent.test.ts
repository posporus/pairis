import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { StoreEvent } from '../src/storage.ts'

Deno.test("Store Event", async t => {
    const testEvent1 = new StoreEvent()
    const testEvent2 = new StoreEvent()

    await t.step('subscribe to testEvent2 and trigger after 200ms', async () => {
        self.setTimeout(() => {
            testEvent2.trigger()
        }, 200)
        const e2 = await (() => new Promise(resolve => {
            testEvent2.subscribe((e) => {
                resolve(e)
            })
        }))()
        assertEquals(e2, testEvent2)
    })


    await t.step('subscribe to testEvent1 and trigger after 200ms', async () => {
        self.setTimeout(() => {
            testEvent1.trigger()
        }, 200)
        const e1 = await (() => new Promise(resolve => {
            testEvent1.subscribe((e) => {
                resolve(e)
            })
        }))()
        assertEquals(e1, testEvent1)
    })



})
/* 
Deno.test("event payload", async t => {
    const testEvent1 = new StoreEvent()
    const testEvent2 = new StoreEvent()


    await t.step('trigger with payload: string', () => {
        const pl = 'testpayload'
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: string', () => {
        const pl = 'testpayload2'
        testEvent1.subscribe(({payload}) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })


    await t.step('trigger with payload: number', () => {
        const pl = 100
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: negative number', () => {
        const pl = -19
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: 0', () => {
        const pl = 0
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: null', () => {
        const pl = null
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: -0', () => {
        const pl = -0
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

    await t.step('trigger with payload: object', () => {
        const pl = { key: 'testpayload', count: 0, obj: new Object() }
        testEvent1.subscribe(({ payload }) => {
            assertEquals(payload, pl)
        })
        testEvent1.trigger(pl)
    })

})
 */