const Router = require('koa-router');
const router = new Router();
const JWT = require('../utils/JWT');
const pool = require('../config/pool');

router.get('/world', async (ctx, next) => {
    const pageNo = Number(ctx.query.pageNo) || 0;
    const pageDelta = Number(ctx.query.pageDelta) || 0;
    const pageSize = Number(ctx.query.pageSize) || 20;
    const msg = await pool.query('SELECT CASE WHEN w.recall = 0 THEN w.message ELSE NULL END AS message,w.create_time,u.username,u.avatar,u.id,w.world_msg_id as msg_id,w.read_list,w.recall FROM world w INNER JOIN users u ON w.from_id=u.id ORDER BY w.create_time desc limit ?,?', [pageNo * pageSize + pageDelta, pageSize]);
    if (msg[0].length === 0) {
        ctx.body = { ok: 0, msg: '没有更多消息' };
        return;
    }
    let message = msg[0]
    for(let i=0;i<message.length;i++){
        const item = message[i]
        message[i].read_list = item.read_list.split(",").filter(Boolean)
        for (let j = 0; j < message[i].read_list.length; j++) {
            let user = await pool.query('SELECT avatar,username,id FROM users WHERE id=?', [message[i].read_list[j]]);
            message[i].read_list[j] = user[0][0]
        }
    }
        
    ctx.body = { ok: 1, msg: message.reverse() };
})

router.get('/private', async (ctx, next) => {
    const pageNo = Number(ctx.query.pageNo) || 0;
    const pageDelta = Number(ctx.query.pageDelta) || 0;
    const pageSize = Number(ctx.query.pageSize) || 20;
    const { from, to } = ctx.query;
    const from_id = JWT.verify(from).id;
    if (!from_id) ctx.body = { ok: 0, msg: '用户未登录' };
    const info = await pool.query('SELECT p.create_time,CASE WHEN p.recall = 0 THEN p.message ELSE NULL END AS message,u.username,u.avatar,u.id,p.private_msg_id as msg_id,p.to_read,p.recall FROM private p INNER JOIN users u ON p.from_id=u.id WHERE from_id=? AND to_id=? OR to_id=? AND from_id=? ORDER BY p.create_time desc limit ?,?', [from_id, to, from_id, to, pageNo * pageSize + pageDelta, pageSize]);
    if (info[0].length === 0) {
        ctx.body = { ok: 0, msg: '没有更多消息' };
        return;
    }
    ctx.body = { ok: 1, msg: info[0].reverse() };
})

module.exports = router