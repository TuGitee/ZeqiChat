const Router = require('koa-router');
const router = new Router();
const pool = require('../config/pool');
const JWT = require('../utils/JWT');

router.get('/', async (ctx, next) => {
    const userId = Number(ctx.query.userId) || null;
    const pageNo = Number(ctx.query.pageNo) || 0;
    const pageDelta = Number(ctx.query.pageDelta) || 0;
    const pageSize = Number(ctx.query.pageSize) || 20;

    let res;

    if (userId) res = await pool.query('SELECT b.create_time,u.username,u.id,b.content,b.images,b.blog_id,u.avatar FROM blog b INNER JOIN users u ON b.user=u.id WHERE b.user=? ORDER BY create_time desc limit ?,?', [userId, pageNo * pageSize + pageDelta, pageSize]);
    else res = await pool.query('SELECT b.create_time,u.username,u.id,b.content,b.images,b.blog_id,u.avatar FROM blog b INNER JOIN users u ON b.user=u.id ORDER BY create_time desc limit ?,?', [pageNo * pageSize + pageDelta, pageSize]);

    let blogList = res[0].reverse();

    if (blogList.length === 0) {
        ctx.body = { ok: 0, msg: '没有更多消息' };
        return;
    }

    for (let i = 0; i < blogList.length; i++) {
        const commentList = await pool.query('SELECT c.create_time,u.username,u.id,c.msg,u.avatar,c.comment_id FROM comment c INNER JOIN users u INNER JOIN blog b ON c.user_id=u.id AND c.blog_id=b.blog_id WHERE c.blog_id=? ORDER BY c.create_time desc', [blogList[i].blog_id]);
        blogList[i].commentList = commentList[0];
    }

    ctx.body = { ok: 1, msg: blogList };
})

router.post('/', async (ctx, next) => {
    const { user, content, images } = ctx.request.body;
    const user_id = JWT.verify(user).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };

    await pool.query('INSERT INTO blog (user,content,images) VALUES (?,?,?)', [user_id, content, images]);
    ctx.body = { ok: 1 };
})

router.delete('/', async (ctx, next) => {
    const { id, user } = ctx.query;
    const user_id = JWT.verify(user).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    await pool.query('DELETE FROM blog WHERE blog_id=? and user=?', [id, user_id]);
    ctx.body = { ok: 1 };
})

router.post('/comment', async (ctx, next) => {
    const { user, msg, blog_id } = ctx.request.body;
    const user_id = JWT.verify(user).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    await pool.query('INSERT INTO comment (user_id,blog_id,msg) VALUES (?,?,?)', [user_id, blog_id, msg]);
    ctx.body = { ok: 1 };
})

module.exports = router