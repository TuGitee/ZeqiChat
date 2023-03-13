const Router = require('koa-router');
const router = new Router();
const multer = require('@koa/multer');
const upload = multer({ dest: 'public/uploads/' });
const CAPTCHA = require('../utils/CAPTCHA');
const JWT = require('../utils/JWT');
const pool = require('../config/pool');
const fs = require('fs');
const { transporter, receiver } = require('../utils/MAIL')
const webp = require('webp-converter');

router.post('/user', upload.single('avatar'), async (ctx, next) => {
    const { email, username, password, repassword, captcha } = ctx.request.body;
    const ecaptcha = ctx.session.captcha?.captcha;
    if (ecaptcha !== captcha) {
        ctx.body = { ok: 0, msg: '验证码错误' };
        return;
    }
    if (password !== repassword) {
        ctx.body = { ok: 0, msg: '两次密码不一致' };
        return;
    }
    const userEmail = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (userEmail[0].length !== 0) {
        ctx.body = { ok: 0, msg: '邮箱已被注册' };
        return;
    }
    const userUsername = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (userUsername[0].length !== 0) {
        ctx.body = { ok: 0, msg: '用户名重复！' };
        return;
    }

    if (ctx.file) {
        let imgType = ctx.file.mimetype;
        if (imgType == "image/png" || imgType == "image/jpeg" || imgType == "image/gif" || imgType == "image/bmp" || imgType == "image/jpg" || imgType == "image/webp") {
            await webp.cwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 90")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('delete') })
        }
    }
    const avatar = ctx.file ? `/uploads/${ctx.file.filename}.webp` : `/images/default_avatar.png`

    pool.query('INSERT INTO users (email,username,password,avatar) VALUES (?,?,?,?)', [email, username, password, avatar])
    ctx.session.captcha = null;
    ctx.body = { ok: 1 };
})

router.put('/user', upload.single('avatar'), async (ctx, next) => {
    const { username, token } = ctx.request.body;
    const user = JWT.verify(token);
    if (!user) ctx.body = { ok: 0, msg: '用户未登录' };
    if (ctx.file) {
        let imgType = ctx.file.mimetype;
        if (imgType == "image/png" || imgType == "image/jpeg" || imgType == "image/bmp" || imgType == "image/jpg" || imgType == "image/webp") {
            await webp.cwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 0")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
            if(user.avatar !== '/images/default_avatar.png') fs.unlink(`public/uploads/${user.avatar}`, () => { console.log('old avatar delete') })
        } else if (imgType == "image/gif") {
            await webp.gwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 100")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
            if(user.avatar !== '/images/default_avatar.png') fs.unlink(`public/uploads/${user.avatar}`, () => { console.log('old avatar delete') })
        }
    }
    const avatar = ctx.file ? `/uploads/${ctx.file.filename}.webp` : user.avatar
    await pool.query('UPDATE users SET username=?,avatar=? WHERE id=?', [username, avatar, user.id])
    const newToken = JWT.generate({
        username: username,
        id: user.id,
        email: user.email,
        avatar: avatar
    }, "1h")
    ctx.set('Authorization', newToken)
    ctx.body = { ok: 1, username, avatar, newToken };
})

router.post('/captcha', async (ctx, next) => {
    const { email } = ctx.request.body;
    let captcha = ctx.session.captcha && ctx.session.captcha.email === email ? ctx.session.captcha.captcha : CAPTCHA(6);
    ctx.session.captcha = { email, captcha };
    await transporter.sendMail(receiver(email, captcha), (err) => {
        if (err) {
            console.log('Email error: ' + err);
        } else {
            console.log('Email sent: ' + mailOptions.to);
        }
    })
    ctx.body = { ok: 1 };
})

router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    const user = await pool.query('SELECT * FROM users WHERE email=? AND password=? OR username=? AND password=?', [email, password, email, password]);
    if (user[0].length === 0) {
        ctx.body = { ok: 0, msg: '用户名或密码错误' };
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

const pageSize = 20;
router.get('/chat/world', async (ctx, next) => {
    const pageNo = Number(ctx.query.pageNo) || 0;
    const pageDelta = Number(ctx.query.pageDelta) || 0;
    const msg = await pool.query('SELECT w.message,w.create_time,u.username,u.avatar FROM world w INNER JOIN users u ON w.from_id=u.id ORDER BY w.create_time desc limit ?,?', [pageNo * pageSize + pageDelta, pageSize]);
    if (msg[0].length === 0) {
        ctx.body = { ok: 0, msg: '没有更多消息' };
        return;
    }
    ctx.body = { ok: 1, msg: msg[0].reverse() };
})

router.get('/chat/private', async (ctx, next) => {
    const pageNo = Number(ctx.query.pageNo) || 0;
    const pageDelta = Number(ctx.query.pageDelta) || 0;
    const { from, to } = ctx.query;
    const from_id = JWT.verify(from).id;
    const info = await pool.query('SELECT p.create_time,p.message,u.username,u.avatar FROM private p INNER JOIN users u ON p.from_id=u.id WHERE from_id=? AND to_id=? OR to_id=? AND from_id=? ORDER BY p.create_time desc limit ?,?', [from_id, to, from_id, to, pageNo * pageSize + pageDelta, pageSize]);
    if (info[0].length === 0) {
        ctx.body = { ok: 0, msg: '没有更多消息' };
        return;
    }
    ctx.body = { ok: 1, msg: info[0].reverse() };
})



module.exports = router;