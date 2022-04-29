import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class NewIngredient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            calories: 0,
            fat: 0,
            protein: 0,
            carbs: 0,
            density: 1,
            liquid: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit (event) {
        
        console.log(event)
        await this.postData({ ...this.state })
        
        const checkbox = document.getElementById("new-ingredient")
        checkbox.checked = false
        event.preventDefault();

    }

    async postData (data) {
        console.log('ingr data',data)
        await fetch('/ingredient/new', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        this.props.onNew()

    }

    render () {
        return (html`
        
            <input type="checkbox" id="new-ingredient" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <label for="new-ingredient" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 class="font-bold text-lg">${'Create new ingredient'}</h3>
                    <div class="divider"></div>

                    <form onSubmit=${this.handleSubmit}>
            
                        <label class="label">
                            <span class="label-text">Name</span>
                            <input type="text" name="name" value=${this.state.name} onChange=${this.handleChange}
                                class="input input-bordered" />
                        </label>
            
                        <label class="label">
                            <span class="label-text">Calories/100g</span>
                            <input type="number" name="calories" value=${this.state.calories} onChange=${this.handleChange}
                                class="input input-bordered" />
                        </label>
            
                        <label class="label">
                            <span class="label-text">Fat/100g</span>
                            <input type="number" name="fat" value=${this.state.fat} onChange=${this.handleChange}
                                class="input input-bordered" />
                        </label>
            
                        <label class="label">
                            <span class="label-text">Protein/100g</span>
                            <input type="number" name="protein" value=${this.state.protein} onChange=${this.handleChange}
                                class="input input-bordered" />
                        </label>
            
                        <label class="label">
                            <span class="label-text">Carbs/100g</span>
                            <input type="number" name="carbs" value=${this.state.carbs} onChange=${this.handleChange}
                                class="input input-bordered" />
                        </label>
            
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