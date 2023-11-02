const Koa = require('koa');
const app = new Koa();
const m_static = require('koa-static');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const session = require('koa-session-minimal')
const JWT = require('./utils/JWT');
const cors = require('koa2-cors');
const fs = require('fs')

const http = require('http')

// const https = require('https')
const sslify = require('koa-sslify').default

// const options = {
//  key: fs.readFileSync('./config/zeqichat.xyz.key'),
//  cert: fs.readFileSync('./config/zeqichat.xyz.pem'),
// }
// const server = https.createServer(options, app.callback());

const server = http.createServer({}, app.callback());

// const server = https.createServer({}, app.callback());

// app.use(sslify())

app.use(cors({
    credentials: true,
    origin: ctx => ctx.header.origin
}))


app.use(bodyparser());

app.use(async (ctx, next) => {
    if (ctx.url.includes("/uploads/") || ctx.url.includes("/images/")) {
        ctx.set('Cache-Control', 'max-age=3179200')
    }
    await next()
})

app.use(m_static(path.join(__dirname, 'public')));

app.use(session({
    key: 'captcha',
    cookie: {
        maxAge: 1000 * 60 * 5,
    }
}))


app.use(async (ctx, next) => {
    if (ctx.url.includes("login")||ctx.url.includes("register")||ctx.url.includes("captcha")||ctx.url.includes("user") && ctx.method === "POST") {
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


// app.listen(3000, '0.0.0.0', () => { })
// https.createServer(options, app.callback()).listen(3000,'0.0.0.0');
// https.createServer(app.callback()).listen(3000,'0.0.0.0');

const start = require('./routers/Socket.io');
start(server);

server.listen(3000, '0.0.0.0', () => {
    console.log('server is running on port 3000')
});