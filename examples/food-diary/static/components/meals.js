import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
import { ListMeals } from './list-meals.js'
import { NewMeal } from './new-meal.js'

export class Meals extends Component {

    constructor(props) {
        super(props);
        this.state = { meals: [], editor: false }
        this.fetchData()
    }

    fetchData () {
        fetch('/meal/').then(result => {
            result.json().then(json => {
                console.log('this', this)
                this.setState({ meals: json })
            })
        })
    }

    updateMeals(meal) {
        this.state.meals.push(meal)
        this.setState({
            ...this.state.meals
        })
    }

/*     showEditor() {
        this.setState({
            editor: true
        })
    }

    hideEditor() {
        this.setState({
            editor: false
        })
    } */

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