import {
    Application,
    HttpError,
    Status
} from './deps.ts'

import {
    bold,
    cyan,
    green,
    red,
    yellow,
} from 'https://deno.land/std@0.131.0/fmt/colors.ts'

import { apiRouter } from './routes/api.router.ts'

const app = new Application();


app.use(apiRouter.routes())

// Error handler middleware
app.use(async (context, next) => {
    try {
        await next();
    } catch (e) {
        if (e instanceof HttpError) {
            // deno-lint-ignore no-explicit-any
            context.response.status = e.status as any;
            if (e.expose) {
                context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>${e.status} - ${e.message}</h1>
                </body>
              </html>`;
            } else {
                context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>${e.status} - ${Status[e.status]}</h1>
                </body>
              </html>`;
            }
        } else if (e instanceof Error) {
            context.response.status = 500;
            context.response.body = `<!DOCTYPE html>
              <html>
                <body>
                  <h1>500 - Internal Server Error</h1>
                </body>
              </html>`;
            console.log("Unhandled Error:", red(bold(e.message)));
            console.log(e.stack);
        }
    }
});

// Logger
app.use(async (context, next) => {
    await next();
    const rt = context.response.headers.get("X-Response-Time");
    console.log(
        `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${bold(
            String(rt),
        )
        }`,
    );
});

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

