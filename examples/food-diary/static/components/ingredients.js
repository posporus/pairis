import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
import { ListIngredients } from './list-ingredients.js'
import { AddIngredient } from './add-ingredient.js'

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

    updateIngredients(ingredient) {
        this.state.ingredients.push(ingredient)
        this.setState({
            ...this.state.ingredients
        })
    }

    render () {
        return (html`
            <div>
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Calories</th>
                        <th>Fat</th>
                        <th>Protein</th>
                        <th>Carbs</th>
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
                <${ListIngredients} ingredients=${this.state.ingredients} />
                <${AddIngredient} onNew=${this.updateIngredients.bind(this)}/>
                </tbody>
            </table>
                
            </div>
        `
        )
    }

}