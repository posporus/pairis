import { assertEquals, assert } from "https://deno.land/std@0.77.0/testing/asserts.ts";

import { Model } from '../src/Model.ts'
import { modelStack, models } from '../src/modelStack.ts'

Deno.test({
    name: "modelStack basic",

    async fn (t) {
        models.clear()
        class Test extends Model {
            static list = 'tests'
            name!: string
        }
        //  #Testing
        await t.step('add Model to modelStack', t => {
            modelStack.add(Test)
            assertEquals(models.length, 1)
            assertEquals(models[0], Test)
        })

        await t.step('should findBySinglular() model "Test" from name "test"', t => {
            //modelStack.add(Test)
            assertEquals(modelStack.findBySingular('test'), Test)
            //assertEquals(models[0], Test)
        })

        await t.step('should findByPlural() model "Test" from name "tests"', t => {
            //modelStack.add(Test)
            assertEquals(modelStack.findByPlural('tests'), Test)
            //assertEquals(models[0], Test)
        })



    }
})

/* Deno.test({
    name: "modelStack",

    async fn (t) {

        models
        class Test extends Model {
            static list = 'tests'
            name!: string
        }
        Test.introduce()

        console.log('MODELS:', models)

        //  #Testing
        await t.step('modelStack should have one entry', t => {
            assertEquals(models.length, 1)
        })



    }
}) */