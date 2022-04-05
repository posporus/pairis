import { Reactive } from '../types.ts'
/**
 * Encapsulates a value in an object with an eventhandler that you can subscribe to and that
 * listens for changes or can be triggered manually. 
 * @param value 
 * @returns 
 */
const reactive = <T> (value: T): Reactive<T> => {

    const _value = value

    const reactiveChangeEvent = new Event('reactiveChanged')

    const subscribe = (cb: (e: Event) => void) => addEventListener('reactiveChanged', cb)

    const trigger = () => dispatchEvent(reactiveChangeEvent)

    const state = { _value, subscribe, trigger } as Reactive<T> & { _value: T }

    return Object.defineProperty(state, 'value', {
        get: function () {
            return state._value
        },
        set: function (v) {
            state._value = v
            //TODO:DO I NEED THIS? i usually trigger this manually.
            trigger()
        }
    })

}

export {
    reactive
}
export type {
    Reactive
}