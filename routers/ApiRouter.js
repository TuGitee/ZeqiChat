const Router = require('koa-router');
const router = new Router();
const multer = require('@koa/multer');
const upload = multer({ dest: 'public/uploads' });
const CAPTCHA = require('../utils/CAPTCHA');
const fs = require('fs');
const { transporter, receiver } = require('../utils/MAIL')
const webp = require('webp-converter');

const UserApi = require('./UserApi');
const FriendApi = require('./FriendApi');
const ChatApi = require('./ChatApi');
const LoginApi = require('./LoginApi');
const BlogApi = require('./BlogApi');

router.use("/user", UserApi.routes(), UserApi.allowedMethods());
router.use("/friend", FriendApi.routes(), FriendApi.allowedMethods());
router.use("/login", LoginApi.routes(), LoginApi.allowedMethods());
router.use("/chat", ChatApi.routes(), ChatApi.allowedMethods());
router.use("/blog", BlogApi.routes(), BlogApi.allowedMethods());

router.post('/captcha', async (ctx, next) => {
    const { email } = ctx.request.body;
    let captcha = ctx.session.captcha && ctx.session.captcha.email === email ? ctx.session.captcha.captcha : CAPTCHA(6);
    ctx.session.captcha = { email, captcha };
    await transporter.sendMail(receiver("注册",email, captcha), (err) => {
        if (err) {
            console.log('Email error: ' + err);
        } else {
            console.log('Email sent: ' + mailOptions.to);
        }
    })
    ctx.body = { ok: 1 };
})

router.post('/image', upload.single('image'), async (ctx, next) => {
    if (ctx.file) {
        let imgType = ctx.file.mimetype;
        if (imgType == "image/png" || imgType == "image/jpeg" || imgType == "image/bmp" || imgType == "image/jpg" || imgType == "image/webp") {
            await webp.cwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 30")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
        } else if (imgType == "image/gif") {
            await webp.gwebp(`public/uploads/${ctx.file.filename}`, `public/uploads/${ctx.file.filename}.webp`, "-q 20")
            fs.unlink(`public/uploads/${ctx.file.filename}`, () => { console.log('new avatar delete') })
        }
    }
    const image = ctx.file ? `/uploads/${ctx.file.filename}.webp` : `/images/default_avatar.png`
    ctx.body = { ok: 1, image };
})

router.post('/audio', upload.single('audio'), async (ctx, next) => {
    const audio = `/uploads/${ctx.file.filename}`
    ctx.body = { ok: 1, audio };
})

module.exports = router;