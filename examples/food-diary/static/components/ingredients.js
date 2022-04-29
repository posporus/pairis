import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
import { ListIngredients } from './list-ingredients.js'
import { NewIngredient } from './new-ingredient.js'

export class Ingredients extends Component {

    constructor(props) {
        super(props);
        this.state = { ingredients: [], editor: false }
        this.fetchData()
    }

    fetchData () {
        fetch('/ingredient/').then(result => {
            result.json().then(json => {
                console.log('this', this)
                this.setState({ ingredients: json })
            })
        })
    }

    render () {
        return (html`
            <div>
                <${ListIngredients} ingredients=${this.state.ingredients} />
                <${NewIngredient} show=${this.state.editor} onNew=${this.fetchData.bind(this)} />
                <label for="new-ingredient" class="btn modal-button btn-secondary fixed bottom-2 right-2">new</label>
            </div>
        `
        )
    }

}