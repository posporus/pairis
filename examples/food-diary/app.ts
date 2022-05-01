import {
    App,
    SpaBuilder
} from './deps.ts'

import { ApiArea } from './areas/main.area.ts'

const app = new App({
    areas: [ApiArea],
})

app.use(
    new RegExp('/'),
    new SpaBuilder({
        root: `${Deno.cwd()}/static`,
        index: "index.html",
    }),
);

//const PORT =/*  Deno.env.get('PORT') || */ '8000'
app.listen(undefined, Deno.listen({ port: 8080 }))