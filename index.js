const Koa = require('koa');
const app = new Koa();
const m_static = require('koa-static');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const views = require('koa-views');
const session = require('koa-session-minimal')
const JWT = require('./utils/JWT');
const cors = require('koa2-cors');
// const fs = require('fs')
const http = require('http')

// const https = require('https')
// const sslify = require('koa-sslify').default

// const options = {
//  key: fs.readFileSync('/www/server/panel/vhost/cert/择栖聊天室/fullchain.pem'),
//  cert: fs.readFileSync('/www/server/panel/vhost/cert/择栖聊天室/privkey.pem'),
// }

// app.use(sslify())

app.use(cors({
    credentials: true,
    origin: ctx => ctx.header.origin
}))


app.use(bodyparser());
app.use(m_static(path.join(__dirname, 'public')));
// app.use(views(path.join(__dirname, 'public/html'), { map: { html: 'ejs' } }));

app.use(session({
    key: 'captcha',
    cookie: {
        maxAge: 1000 * 60 * 5,
    }
}))

// app.use(async (ctx, next)=> {
//   ctx.set('Access-Control-Allow-Origin', '');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type');
//   ctx.set("Access-Control-Allow-Credentials", "true");
//   ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   await next();
// });

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


app.listen(3000, '0.0.0.0', () => { })
// https.createServer(options, app.callback()).listen(3000,'0.0.0.0');
// https.createServer(app.callback()).listen(3000,'0.0.0.0');

const start = require('./routers/Socket.io');
const server = http.createServer(app);
start(server);
server.listen(8080, '0.0.0.0', () => {
});