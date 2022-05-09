import {
    Application
} from './deps.ts'

import {apiRouter} from './routes/api.router.ts'

const app = new Application();


app.use(apiRouter.routes())

app.use(async (context, next) => {
    try {
        await context.send({
            root: `${Deno.cwd()}/static`,
            index: "index.html",
        });
    } catch {
        next();
    }
});


await app.listen({ port: 8000 });

