import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class AddIngredient extends Component {

    constructor(props) {
        super(props)
        this.resetForm()

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    resetForm() {
        this.setState({
            name: '',
            calories: 0,
            fat: 0,
            protein: 0,
            carbs: 0,
            density: 1,
            liquid: false,
        })
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit (event) {
        event.preventDefault()
        const r = await this.postData({ ...this.state })
        const j = await r.json()
        console.log('json',j)
        this.props.onNew(j.ingredient)
        this.resetForm()
        
    }

    async postData (data) {
        console.log('ingr data', data)
        return await fetch('/ingredient/new', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })



    }

    render () {
        return (html`
                    <form id="add-ingredient" onSubmit=${this.handleSubmit}></form>
                    <tr>
                        <td><input type="text" name="name" value=${this.state.name} onChange=${this.handleChange}
                                class="input input-bordered input-sm" form="add-ingredient" /></td>
                        <td><input type="number" name="calories" value=${this.state.calories} onChange=${this.handleChange}
                                class="input input-bordered input-sm w-16" form="add-ingredient" /></td>
                        <td><input type="number" name="fat" value=${this.state.fat} onChange=${this.handleChange}
                                class="input input-bordered input-sm w-16" form="add-ingredient" /></td>
                        <td><input type="number" name="protein" value=${this.state.protein} onChange=${this.handleChange}
                                class="input input-bordered input-sm w-16" form="add-ingredient" /></td>
                        <td><input type="number" name="carbs" value=${this.state.carbs} onChange=${this.handleChange}
                                class="input input-bordered input-sm w-16" form="add-ingredient" /></td>
                        <td><button class="btn btn-sm" type="submit" form="add-ingredient">add</button></td>
                    
                    </tr>
                
        `
        )
    }

}