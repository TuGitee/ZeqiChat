const Router = require('koa-router');
const router = new Router();
const multer = require('@koa/multer');
const upload = multer({ dest: 'public/uploads' });
const JWT = require('../utils/JWT');
const pool = require('../config/pool');
const fs = require('fs');
const webp = require('webp-converter');

router.get('/', async (ctx, next) => {
    const key = ctx.query.key || ''
    if (!key.trim()) {
        ctx.body = { ok: 1, data: [] };
    }
    const user = await pool.query('SELECT id,email,username,avatar FROM users WHERE email like ? or username like ?', [`%${key}%`, `%${key}%`]);
    ctx.body = { ok: 1, data: user[0] };
})

router.get('/:id', async (ctx, next) => {
    const key = ctx.params.id
    const user = await pool.query('SELECT id,email,username,avatar FROM users WHERE id=?', [key]);
    if (user[0].length)
        ctx.body = { ok: 1, data: user[0][0] };
    else
        ctx.body = { ok: 0, data: "查无此人!" }
})

router.post('/', upload.single('avatar'), async (ctx, next) => {
    const { email, username, password, repassword, captcha } = ctx.request.body;
    if (ctx.session.captcha?.captcha !== captcha && ctx.session.captcha?.email !== email) {
        ctx.body = { ok: 0, msg: '验证码错误' };
        return;
    }

    if (password !== repassword) {
        ctx.body = { ok: 0, msg: '两次密码不一致' };
        return;
    }
    const userEmail = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (userEmail[0].length !== 0) {
        ctx.body = { ok: 0, msg: '邮箱已被注册' };
        return;
    }
    const userUsername = await pool.query('SELECT id FROM users WHERE username=?', [username]);
    if (userUsername[0].length !== 0) {
        ctx.body = { ok: 0, msg: '用户名重复！' };
        return;
    }

    if (ctx.file) {
        let imgType = ctx.file.mimetype;
        if (imgType == "image/png" || imgType == "image/jpeg" || imgType == "image/bmp" || imgType == "image/jpg" || imgType == "image/webp") {
            await webp.cwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 0")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
        } else if (imgType == "image/gif") {
            await webp.gwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 100")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
        }
    }
    const avatar = ctx.file ? `/uploads/${ctx.file.filename}.webp` : `/images/default_avatar.png`

    pool.query('INSERT INTO users (email,username,password,avatar) VALUES (?,?,?,?)', [email, username, password, avatar])
    ctx.session.captcha = null;
    ctx.body = { ok: 1 };
})

router.put('/', upload.single('avatar'), async (ctx, next) => {
    const { username, token } = ctx.request.body;
    const user = JWT.verify(token);
    if (!user) ctx.body = { ok: 0, msg: '用户未登录' };
    if (ctx.file) {
        let imgType = ctx.file.mimetype;
        if (imgType == "image/png" || imgType == "image/jpeg" || imgType == "image/bmp" || imgType == "image/jpg" || imgType == "image/webp") {
            await webp.cwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 0")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
            if (user.avatar !== '/images/default_avatar.png') fs.unlink(`public/uploads/${user.avatar}`, () => { console.log('old avatar delete') })
        } else if (imgType == "image/gif") {
            await webp.gwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 100")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
            if (user.avatar !== '/images/default_avatar.png') fs.unlink(`public/uploads/${user.avatar}`, () => { console.log('old avatar delete') })
        }
    }
    const avatar = ctx.file ? `/uploads/${ctx.file.filename}.webp` : user.avatar
    try {
        await pool.query('UPDATE users SET username=?,avatar=? WHERE id=?', [username, avatar, user.id])
        const newToken = JWT.generate({
            username: username,
            id: user.id,
            email: user.email,
            avatar: avatar
        }, "1h")
        ctx.set('Authorization', newToken)
        ctx.body = { ok: 1, username, avatar, newToken };
    } catch (e) {
        ctx.body = { ok: 0, msg: "用户名重复！" };
    }

})

module.exports = router