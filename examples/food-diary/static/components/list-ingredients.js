import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class ListIngredients extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (html`
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.props.ingredients.map(item => (
                        html`
                        <tr key=${item.uid}>
                        <td>${item.name}</td>
                    </tr>
                    `
                    ))}
                </tbody>
            </table>
            
        `
        )
    }

}