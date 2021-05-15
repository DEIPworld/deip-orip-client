const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors({
  origin: "*",
  allowHeaders: "*",
  allowMethods: "*"
}));

app.use(serve(`${__dirname}/dist`));
router.get('/env', (ctx) => {
  ctx.status = 200;
  ctx.body = require('./config/env.js');
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

app.on('error', function (err, ctx) {
  console.log('Serving error', err);
});