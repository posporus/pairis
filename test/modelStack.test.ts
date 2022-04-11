import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";

import { Model } from '../src/Model.ts'
import { ModelStack } from '../src/storage.ts'

const modelStack = new ModelStack()

Deno.test({
    name: "modelStack basic",

    async fn (t) {
        modelStack.clear()
        class Test extends Model {
            static list = 'tests'
            name!: string
        }
        //  #Testing
        await t.step('add Model to modelStack', t => {
            modelStack.push(Test)
            assertEquals(modelStack.length, 1)
            assertEquals(modelStack[0], Test)
        })

        await t.step('should findBySinglular() model "Test" from name "test"', t => {
            assertEquals(modelStack.findBySingular('test'), Test)
        })

        await t.step('should findByPlural() model "Test" from name "tests"', t => {
            assertEquals(modelStack.findByPlural('tests'), Test)
        })

    }
})
