const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const views = require('koa-views');
const session = require('koa-session-minimal')
const JWT = require('./utils/JWT');

app.use(bodyparser());
app.use(static(path.join(__dirname, 'public')));
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }));

app.use(session({
    key: 'captcha',
    cookie: {
        maxAge: 1000 * 60 * 5
    }
}))

app.use(async (ctx, next) => {
    if (ctx.url.includes("login")) {
        await next()
        return;
    }
    const token = ctx.headers.authorization?.split(" ")[1]
    if (token) {
        const playload = JWT.verify(token)
        if (playload) {
            const newToken = JWT.generate({
                username: playload.username,
                id: playload.id,
                email: playload.email,
                avatar: playload.avatar
            }, "1h")
            ctx.set('Authorization', newToken)
            await next()
        } else {
            ctx.status = 401
            ctx.body = { ok: 0 }
        }
    } else {
        await next()
    }
})

const router = require('./routers');
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
    ctx.status = 404;
    ctx.body = '404 - not found';
    await next();
})

app.listen(3000,'192.168.0.9');
router.redirect('/', '/login');

const start = require('./routers/Socket.io');
const server = require('http').createServer(app);
start(server);
server.listen(8080);