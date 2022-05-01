import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
import { AddAmount } from './add-amount.js'
export class NewMeal extends Component {

    constructor(props) {
        super(props);
        //this.state = { name: 'sfa', amounts: [] }
        this.resetForm()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    resetForm() {
        this.setState({
            name:'',
            amounts:[]
        })
    }

    handleChange (event) {
        this.setState({ name: event.target.value });
    }

    pushAmount (amount) {
        console.log('amount:', amount)
        this.state.amounts.push(amount)
        this.setState({
            amounts: this.state.amounts
        })
    }

    cleanedAmounts () {
        return this.state.amounts.map(amount => ({ value: amount.value, ingredient: amount.ingredient.uid }))
    }

    async handleSubmit (event) {
        event.preventDefault()
        const r = await this.postData({ name: this.state.name, amounts: this.cleanedAmounts() })
        const meal = await r.json()
        const checkbox = document.getElementById("my-modal")
        checkbox.checked = false

        this.props.onNew(meal)
        this.resetForm()

    }

    async postData (data) {
        return await fetch('/meal/new', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

    }

    render (_, { amounts }) {
        return (html`
        
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
            
                    <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 class="font-bold text-lg">${'Create new meal'}</h3>
                    <div class="divider"></div>
                    <form onSubmit=${this.handleSubmit}>
            
                        <div class="form-control">
                            <label class="label">
                                <span>Name</span>
                                <input class="input input-bordered" type="text" value=${this.state.name}
                                    onChange=${this.handleChange} />
                            </label>
                        </div>
            
                        <div class="form-control">
                            ${amounts.map(a => (html`${a.value}g ${a.ingredient.name},`))}
                            <${AddAmount} onAdd=${this.pushAmount.bind(this)} />
            
                        </div>
            
                        <div class="modal-action">
                            <button class="btn" type="submit">add</button>
                        </div>
                    </form>
            
            
                </div>
            </div>
        `
        )
    }

}