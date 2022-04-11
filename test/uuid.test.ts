import { assertEquals, } from 'https://deno.land/std@0.77.0/testing/asserts.ts'
import { uuid, isValidUid } from '../src/uid.ts'

Deno.test("generating UUID", () => {
    assertEquals(isValidUid(uuid()), true);
})