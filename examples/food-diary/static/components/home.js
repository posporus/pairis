import { html, Component } from 'https://cdn.skypack.dev/htm/preact'
export class Home extends Component {
    render = () => (html`
        <div class="hero">
            <div class="hero-content flex flex-col justify-center text-center">
                <h1 class="text-5xl font-bold">Pairis meal database demo</h1>
                <img src="./img/pairis_socks.png" />
                <p class="py-6">
                    This is an simple receipe database demo.
                </p>
                <button class="btn btn-primary">Get Started</button>
            </div>
        </div>
    `)

}