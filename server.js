const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

app.use(serve(__dirname + '/dist'));
router.get('/env', (ctx) => {
    ctx.status = 200;
    ctx.body = require('./config/env.js');
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log(`listening on port ${PORT}`);