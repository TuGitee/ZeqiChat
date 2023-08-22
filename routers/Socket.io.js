const JWT = require('../utils/JWT');
const pool = require('../config/pool');
const { WORLD_ID , WebSocketType} = require('../utils/WORLD');

function start(server) {
    const io = require('socket.io')(server, { cors: true });
    io.on('connect', async (socket) => {
        const payload = JWT.verify(socket.handshake.query.token);
        socket.user = payload;
        if (payload) {
            await pool.query('update users set online=1 where id=?', [socket.user.id])
        } else {
            socket.emit(WebSocketType.Error, createMessage('system', 'token error'))
        }
        socket.on(WebSocketType.GroupList, async () => {
            changeList(io, socket)
        })

        socket.on(WebSocketType.GroupChat, (data) => {
            socket.broadcast.emit(WebSocketType.GroupChat, createMessage(socket.user.username, data.msg, socket.user.avatar, WORLD_ID, +new Date()))
            pool.query('insert into world (from_id,message) values (?,?)', [socket.user.id, data.msg])
        })

        socket.on(WebSocketType.PrivateChat, (data) => {
            io.sockets.sockets.forEach(item => {
                if (item.user.id === Number(data.to)) {
                    item.emit(WebSocketType.PrivateChat, createMessage(socket.user.username, data.msg, socket.user.avatar, String(socket.user.id), +new Date()))
                    pool.query('insert into private (from_id,to_id,message) values (?,?,?)', [socket.user.id, item.user.id, data.msg])
                }
            })
        })

        socket.on(WebSocketType.PrivateRead, async (data) => {
            await pool.query('update private set to_read=1 where from_id=? and to_id=?', [Number(data.to), Number(socket.user.id)])
        })

        socket.on(WebSocketType.WorldRead, async () => {
            await pool.query('update world set read_list=concat(read_list,?) where from_id!=? and read_list not like ?', [`${socket.user.id},`, socket.user.id, `%${socket.user.id}%`])
        })

        socket.on(WebSocketType.FriendRequest, async (data) => {
            io.sockets.sockets.forEach(item => {
                if (item.user.id === Number(data.to)) {
                    item.emit(WebSocketType.FriendRequest, createMessage(socket.user.username, {
                        accept: 0,
                        avatar: socket.user.avatar,
                        username: socket.user.username,
                        from_id: socket.user.id,
                    }, socket.user.avatar, String(socket.user.id), +new Date()))
                }
            })
        })

        socket.on(WebSocketType.FriendAccept, async (data) => {
            io.sockets.sockets.forEach(async item => {
                if (item.user.id === Number(data.to)) {
                    let last = await pool.query('select * from private where from_id=? and to_id=? or to_id=? and from_id=?', [item.user.id, socket.user.id, item.user.id, socket.user.id])
                    last = last[0]
                    item.emit(WebSocketType.FriendAccept, createMessage(socket.user.username, {
                        avatar: socket.user.avatar,
                        username: socket.user.username,
                        id: socket.user.id,
                        unread: 0,
                        online: 1,
                        last: last[last.length-1] ?? '',
                    }, socket.user.avatar, String(socket.user.id), +new Date()))
                }
            })
        })

        socket.on(WebSocketType.FriendReject, async (data) => {
            io.sockets.sockets.forEach(item => {
                if (item.user.id === Number(data.to)) {
                    item.emit(WebSocketType.FriendReject, createMessage(null, null, null, socket.user.id, +new Date()))
                }
            })
        })

        socket.on('disconnect', () => {
            pool.query('update users set online=0 where id=?', [socket.user.id])
            changeList(io, socket)
        })
    })
}

function createMessage(user, data, avatar, id, time) {
    return {
        user,
        data,
        avatar,
        id,
        time
    }
}

async function changeList(io, socket) {
    const data = []
    const users = Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)
    
    // let world = await pool.query('select * from world where read_list not like ? and from_id!=?', [`%${socket.user.id}%`, socket.user.id])
    let world = await pool.query('select w.create_time,u.username,w.message from world w inner join users u on w.from_id=u.id order by w.world_msg_id desc limit 1')
    world = world[0]
    data.push({
        id: WORLD_ID,
        unread: 0,
        to: socket.user.id,
        avatar: "/images/world.jpg",
        username: "World",
        last: world[0]
    })
    for (let item of users) {
        for (let user of users) {
            let last = await pool.query('select * from private where from_id=? and to_id=? or to_id=? and from_id=?', [user.id, item.id, user.id, item.id])
            last = last[0]
            if (item.id === user.id) {
                data.push({
                    avatar: user.avatar,
                    username: user.username,
                    id: user.id,
                    unread: 0,
                    to: item.id,
                    last: last[last.length-1]??''
                })
            }

            else {
                let res = await pool.query('select * from private where from_id=? and to_id=? and to_read=0', [user.id, item.id])
                let msg = res[0]
                data.push({
                    avatar: user.avatar,
                    username: user.username,
                    id: user.id,
                    unread: msg.length,
                    to: item.id,
                    last: last[last.length-1]??''
                })
            }
        }
    }
    io.sockets.emit(WebSocketType.GroupList, createMessage('system', data))
}

module.exports = start