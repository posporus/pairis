import { render, html, Component, h } from 'https://cdn.skypack.dev/htm/preact'
import Router, { Link } from 'https://cdn.skypack.dev/preact-router'
import { Home } from './home.js'
import { Meals } from './meals.js'
import { Ingredients } from './ingredients.js'

class App extends Component {
    render () {
        return html`
            <div class="navbar bg-base-100">
                <${Link} class="btn btn-ghost normal-case text-xl" href="/">Pairis Demo</ />
                    <div class="divider divider-horizontal"></div>
                    <ul class="menu menu-horizontal bg-base-100 rounded-box p-2">
            
                        <li>
                            <${Link} href="/meals">Meals</ />
                        </li>
                        <li>
                            <${Link} href="/ingredients">Ingredients</ />
                        </li>
                    </ul>
            </div>
            
            <${Router}>
                <${Home} path="/" default />
                <${Meals} path="/meals" />
                <${Ingredients} path="/ingredients" />
                <//>
            `
    }
}



render(html`<${App} />`, document.body);