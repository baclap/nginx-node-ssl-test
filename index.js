const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// X-Response-Time header
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// Log request
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// Parse body
app.use(bodyParser());

// GET /
router.get('/', (ctx, next) => {
    ctx.body = 'hello';
});

// POST /
router.post('/', (ctx, next) => {
    const body = ctx.request.body;
    if (body.foo) {
        body.hello = 'world';
    }
    ctx.body = body;
});

app.use(router.routes());

app.listen(3000);
console.log('Listening on port 3000...');
