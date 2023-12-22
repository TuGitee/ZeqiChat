const Router = require('koa-router');
const router = new Router();
const { WORLD_ID } = require('../utils/WORLD');
const JWT = require('../utils/JWT');
const pool = require('../config/pool');

router.get('/', async (ctx, next) => {
    const user = ctx.query.user;
    const user_id = JWT.verify(user).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    const res = await pool.query('SELECT id,username,avatar,online,create_time FROM users WHERE id IN (SELECT to_id AS friend_id FROM friend WHERE from_id =? AND accept=1 UNION SELECT from_id AS friend_id FROM friend WHERE to_id =? AND accept=1)', [user_id, user_id]);
    const userList = res[0]

    const data = []

    let world = await pool.query('SELECT w.create_time, u.username, CASE WHEN w.recall = 0 THEN w.message ELSE NULL END AS message,w.recall FROM world w INNER JOIN users u ON w.from_id = u.id ORDER BY w.world_msg_id DESC limit 1')
    world = world[0]
    data.push({
        id: WORLD_ID,
        unread: 0,
        avatar: "/images/world.jpg",
        username: "World",
        last: world[0] ?? '',
        online: 1
    })
    for (let user of userList) {
        let last = await pool.query('select private_msg_id,create_time,from_id,to_id,to_read,recall,CASE WHEN recall = 0 THEN message ELSE NULL END AS message from private where from_id=? and to_id=? or to_id=? and from_id=? ORDER BY private_msg_id DESC limit 1', [user_id, user.id, user_id, user.id])
        last = last[0]
        if (user.id === user_id) {
            data.push({
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                id: user.id,
                unread: 0,
                last: last[0] ?? '',
                online: user.online
            })
        }

        else {
            let res = await pool.query('select private_msg_id,create_time,from_id,to_id,to_read,recall,CASE WHEN recall = 0 THEN message ELSE NULL END AS message from private where from_id=? and to_id=? and to_read=0 ORDER BY private_msg_id DESC limit 1', [user.id, user_id])
            let msg = res[0]
            data.push({
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                id: user.id,
                unread: msg.length,
                last: last[last.length - 1] ?? '',
                online: user.online
            })
        }
    }
    ctx.body = { ok: 1, data };
})

router.post('/', async (ctx, next) => {
    const { from, to } = ctx.request.body;
    const from_id = JWT.verify(from).id;
    if (!from_id) ctx.body = { ok: 0, msg: '用户未登录' };
    const user = await pool.query('SELECT * FROM friend WHERE (from_id=? AND to_id=? OR from_id=? AND to_id=?) AND (accept=0 OR accept=1)', [from_id, to, to, from_id]);
    if (user[0].length === 0) {
        await pool.query('INSERT INTO friend (from_id,to_id,accept) VALUES (?,?,?)', [from_id, to, from_id == to ? 1 : 0]);
        ctx.body = { ok: 1, msg: "添加成功！" };
    }
    else
        ctx.body = { ok: 0, msg: "你已经添加过TA或TA已经添加了你！" };
})

router.get('/request', async (ctx, next) => {
    const user = ctx.query.user;
    const user_id = JWT.verify(user).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    const res = await pool.query('SELECT u.id,u.username,u.email,u.avatar,f.create_time,f.accept,f.request_id,f.from_id,f.to_id FROM users u inner join friend f on u.id=f.from_id WHERE f.to_id=?', [user_id]);
    const myRes = await pool.query('SELECT u.id,u.username,u.email,u.avatar,f.create_time,f.accept,f.request_id,f.from_id,f.to_id FROM users u inner join friend f on u.id=f.to_id WHERE f.from_id=?', [user_id]);
    const userList = res[0]
    const myRequest = myRes[0]
    ctx.body = { ok: 1, data: { request: userList, send: myRequest } };
})

router.put('/', async (ctx, next) => {
    const { id, to } = ctx.request.body;
    const user_id = JWT.verify(to).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    await pool.query('UPDATE friend SET accept=1 WHERE to_id=? and request_id=?', [user_id, id]);
    ctx.body = { ok: 1, msg: '添加成功！' };
})

router.delete('/', async (ctx, next) => {
    const { id, to } = ctx.query;
    const user_id = JWT.verify(to).id;
    if (!user_id) ctx.body = { ok: 0, msg: '用户未登录' };
    await pool.query('UPDATE friend SET accept=-1 WHERE to_id=? and request_id=?', [user_id, id]);
    ctx.body = { ok: 1, msg: '拒绝成功！' };
})

module.exports = router