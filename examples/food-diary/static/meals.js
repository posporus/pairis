import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
import { ListMeals } from './list-meals.js'
import { NewMeal } from './new-meal.js'

export class Meals extends Component {

    constructor(props) {
        super(props);
        this.state = { meals: [], editor: false }
        this.fetchData()

        //console.log(this.state.meals)
    }

    async fetchData () {
        const result = await fetch('/api/meals/')
        const meals = await result.json()
        this.setState({ meals })
        console.log('meals:', meals)
    }

    updateMeals (meal) {
        this.state.meals.push(meal)
        this.setState({
            ...this.state.meals
        })
    }

    render () {
        return (html`
            <div>
                <${ListMeals} meals=${this.state.meals} />
                <${NewMeal} show=${this.state.editor} onNew=${this.updateMeals.bind(this)} />
                <label for="my-modal" class="btn modal-button btn-secondary fixed bottom-2 right-2">new</label>
            </div>
        `
        )
    }

}