import { html, Component } from 'https://cdn.skypack.dev/htm/preact'

export class ListMeals extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (html`
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Values</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.props.meals.map(item => (
                        html`
                        <tr key=${item.uid}>
                        <td>${item.name}</td>                        
                        <td>
                            ${item.foodValues.calories}kcal |
                            F:${item.foodValues.fat},
                            P:${item.foodValues.protein},
                            C:${item.foodValues.carbs}
                        </td>
                    </tr>
                    `
                    ))}
                </tbody>
            </table>
            
        `
        )
    }

}