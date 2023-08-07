const Router = require('koa-router');
const router = new Router();
const CAPTCHA = require('../utils/CAPTCHA');
const JWT = require('../utils/JWT');
const pool = require('../config/pool');
const { transporter, receiver } = require('../utils/MAIL')

router.get('/', async (ctx, next) => {
    const email = ctx.query.email
    let captcha = ctx.session.captcha && ctx.session.captcha.email === email ? ctx.session.captcha.captcha : CAPTCHA(6);
    ctx.session.captcha = { email, captcha };
    await transporter.sendMail(receiver("登录",email, captcha), (err) => {
        if (err) {
            console.log('Email error: ' + err);
        } else {
            console.log('Email sent: ' + mailOptions.to);
        }
    })
    ctx.body = { ok: 1 };
})

router.post('/', async (ctx, next) => {
    const { email, password, captcha } = ctx.request.body;
    let user;

    if (password)
        user = await pool.query('SELECT * FROM users WHERE email=? AND password=? OR username=? AND password=?', [email, password, email, password]);
    else {
        if (ctx.session.captcha?.captcha != captcha || ctx.session.captcha?.email != email) {
            ctx.body = { ok: 0, msg: '验证码错误' };
            return;
        }
        user = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    }
    if (user[0].length === 0) {
        ctx.body = { ok: 0, msg: '用户名、邮箱或密码错误' };
        return;
    }

    if (user[0][0].online === 1) {
        ctx.body = { ok: 0, msg: '用户已登录' };
        return;
    }

    const token = JWT.generate({
        id: user[0][0].id,
        username: user[0][0].username,
        email: user[0][0].email,
        avatar: user[0][0].avatar
    }, '1h');
    ctx.set('Authorization', token)
    ctx.body = { ok: 1, token, username: user[0][0].username, user: user[0][0].id, avatar: user[0][0].avatar };
})

module.exports = router