import {
    Application,
    HttpError,
    Status,
    Router,
    etag
} from './deps.ts'

import {
    bold,
    cyan,
    green,
    red,
    yellow,
} from 'https://deno.land/std@0.131.0/fmt/colors.ts'

import { apiRouter } from './routes/api.router.ts'

const app = new Application()

//API
app.use(apiRouter.routes())

app.use(etag.factory())

// Error handler middleware
app.use(async (context, next) => {
    try {
        await next()
    } catch (e) {
        if (e instanceof HttpError) {
            // deno-lint-ignore no-explicit-any
            context.response.status = e.status as any
            if (e.expose) {
                context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>${e.status} - ${e.message}</h1>
                </body>
              </html>`
            } else {
                context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>${e.status} - ${Status[e.status]}</h1>
                </body>
              </html>`
            }
        } else if (e instanceof Error) {
            context.response.status = 500
            context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>500 - Internal Server Error</h1>
                </body>
              </html>`
            console.log("Unhandled Error:", red(bold(e.message)))
            console.log(e.stack)
        }
    }
});

// Logger
app.use(async (context, next) => {
    await next()
    const rt = context.response.headers.get("X-Response-Time")
    console.log(
        `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${bold(
            String(rt),
        )
        }`,
    );
});

//Serve Static
/* app.use(async (context, next) => {
    try {
        await context.send({
            root: `${Deno.cwd()}/static`,
            index: "index.html",
        });
    } catch {
        next()
    }
}); */

const front = new Router();
front.get("/", async (ctx) => {
    ctx.response.body = await Deno.readFile("./static/index.html")
})

/* front.get("/index.js", async (ctx) => {
    const indexJs = await Deno.readFile(`./static/index.js`)
    //console.log('index.js',indexJs)
    ctx.response.body = indexJs
}) */

front.get("/:static", async (ctx) => {
    console.log('static request', ctx.params.static)
    const file = await Deno.readFile(`./static/${ctx.params.static}`)
    const value = await etag.calculate(file);
    console.log(value)
    //ctx.response.type = 'module'
    //ctx.response.headers.set("ETag", value);
    if(ctx.params.static.endsWith('.png')) {
        ctx.response.headers.set("content-type", 'image/png');
    }
    else ctx.response.headers.set("content-type", 'application/javascript');

    ctx.response.body = file

})


app.use(front.routes(), front.allowedMethods())


await app.listen({ port: 8000 })