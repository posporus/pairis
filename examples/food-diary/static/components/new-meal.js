import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class NewMeal extends Component {

    constructor(props) {
        super(props);
        this.state = { name: 'sfa' }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange (event) {
        this.setState({ name: event.target.value });
    }

    async handleSubmit (event) {
        await this.postData({ name: this.state.name })

        const checkbox = document.getElementById("my-modal")
        checkbox.checked = false

        event.preventDefault();
    }

    async postData (data) {
        await fetch('/meal/new', {
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
        
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 class="font-bold text-lg">${'Create new meal'}</h3>
                    <div class="divider"></div>
                    <form onSubmit=${this.handleSubmit}>
                        <input class="input input-bordered" type="text" value=${this.state.name} onChange=${this.handleChange} />
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