import {
    assertArrayIncludes,
    assertEquals,
} from "https://deno.land/std@0.77.0/testing/asserts.ts";

import {usePair} from '../src/usePair.ts'
Deno.test("using usePair", (t) => {

    usePair<number>('myKey',0)
    assertEquals(usePair('myKey').value, 0);
})

Deno.test("change after 200ms", async (t) => {

    self.setTimeout(() => {
        usePair('myKey').value = 1
    }, 200)

    await (() => new Promise(resolve => {
        usePair('myKey').subscribe((e) => {
            resolve(e)
        })
    }))()
    assertEquals(usePair('myKey').value, 1);
})