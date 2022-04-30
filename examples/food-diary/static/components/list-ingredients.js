import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class ListIngredients extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (html`
            
                    ${this.props.ingredients.map(item => (
                        html`
                        <tr key=${item.uid}>
                        <td>${item.name}</td>
                        <td>${item.calories}</td>
                        <td>${item.fat}</td>
                        <td>${item.protein}</td>
                        <td>${item.carbs}</td>
                        <td></td>
                    </tr>
                    `
                    ))}
                    
            
        `
        )
    }

}