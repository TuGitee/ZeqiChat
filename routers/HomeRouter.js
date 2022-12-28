const Router = require('koa-router');
const router = new Router();
router.get('/', async (ctx, next) => {
    await ctx.render('home');
});
module.exports = router;