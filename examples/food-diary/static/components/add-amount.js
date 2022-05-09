import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class AddAmount extends Component {

    constructor(props) {
        super(props);
        this.state = { ingredients: [], ingredientUid:'',amount:0 }
        this.fetchData()
    }

    resetForm = () => {
        this.setState({
            ingredientUid: '',
            amount: 0
        })
    }

    fetchData () {
        fetch('/api/ingredients/').then(result => {
            result.json().then(json => {
                //console.log('this', this)
                this.setState({ ingredients: json })
            })
        })
    }

    onIngredientChange = (e) => {
        this.setState({ ingredientUid: e.target.value })
    }

    onAmountChange = (e) => {
        this.setState({ amount: e.target.value })
    }

    add() {
        const toBeAdded = this.state.ingredients.find(ingr => ingr.uid === this.state.ingredientUid)
        this.props.onAdd({
            ingredient:toBeAdded,
            value:this.state.amount
        })
        this.resetForm()
    }

    render (_,{ingredients,ingredientUid,amount}) {
        return (html`
        <div class="input-group">
            
            <select value=${ingredientUid} class="select select-bordered" onChange=${this.onIngredientChange}>
                ${
                    ingredients.map(item=>(
                        html`
                            <option value=${item.uid}>${item.name}</option>
                        `
                    ))
                }
                
    
            </select>
            <input type="text" value=${amount} onChange=${this.onAmountChange} placeholder="10"  class="input input-bordered w-16"/>
            <button type="button" class="btn btn-primary" onClick=${this.add.bind(this)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
            
            </div>
        `
        )
    }

}