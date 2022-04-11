/**
 * # Example: simple Todo-list
 * ## Features
 * [x] creating tasks
 * [ ] deleting tasks
 * [x] set dasks to 'done'
 */

import Ask from 'https://deno.land/x/ask@1.0.6/mod.ts'

import { Model, persist, PairisStore } from '../../mod.ts'

const store = new PairisStore(localStorage)
//defining model
@persist(store)
class Todo extends Model {
    static list = 'todos'
    task!: string
    done = false

    print (number: number) {
        console.log(`${number}: [${this.done ? '✔' : ' '}] ${this.task}`)
    }
    toggle () {
        this.done = !this.done
    }

}

if (localStorage.length === 0) {
    //creating example items
    Todo.use().set({
        task: 'Writing a todo list',
        done: true
    })

    Todo.use().set({
        task: 'Cleaning the bathroom'
    })
}
const ask = new Ask()

//program menu
while (true) {

    console.clear()
    console.log(localStorage)

    //retrieving all items from list 'todos'
    const todos = Todo.all()

    console.log('To-Do\'s:')
    todos.forEach((todo, i) => {
        todo.print(i + 1)
    })

    console.log('>> Type "new" to create a new task, "clear" to clear store or [number] to toggle check.')

    const { input } = await ask.input({
        name: 'input',
        message: 'Input:',
    });

    if (input === undefined || input === '' || input === 'exit') break
    if (input === 'clear') store.clear()
    if (input === 'new') {
        const { task } = await ask.input({
            name: 'task',
            message: 'New task:',
        })

        Todo.use().set({ task })
    }
    else {
        if (todos[+input - 1]) todos[+input - 1].toggle()
    }

}