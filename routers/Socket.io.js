const JWT = require('../utils/JWT');
const pool = require('../config/pool');

const WorldID = 'd29ybGQ=';

function start(server) {
    const io = require('socket.io')(server, { cors: true });
    io.on('connect', (socket) => {
        const payload = JWT.verify(socket.handshake.query.token);
        if (payload) {
            socket.user = payload;
            socket.emit(WebSocketType.System, createMessage('system', 'hello world!'))
        } else {
            socket.emit(WebSocketType.Error, createMessage('system', 'token error'))
        }
        socket.on(WebSocketType.GroupList, async () => {
            changeList(io)
            let users = Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)
            let data = []
            for (let item of users) {
                let res = await pool.query('select * from world where read_list not like ? and from_id!=?', [`%${item.id}%`, item.id])
                let msg = res[0]
                data.push({
                    id: WorldID,
                    unread: msg.length,
                    to: item.id,
                })
            }
            io.sockets.emit(WebSocketType.WorldItem, createMessage('system', data, '', WorldID))
        })
        socket.on(WebSocketType.GroupChat, (data) => {
            socket.broadcast.emit(WebSocketType.GroupChat, createMessage(data.user, data.msg, socket.user.avatar, WorldID))
            pool.query('insert into world (from_id,message) values (?,?)', [socket.user.id, data.msg])
        })
        socket.on(WebSocketType.PrivateChat, (data) => {
            io.sockets.sockets.forEach(item => {
                if (item.user.id === Number(data.to)) {
                    item.emit(WebSocketType.PrivateChat, createMessage(data.user, data.msg, socket.user.avatar, String(socket.user.id)))
                    pool.query('insert into private (from_id,to_id,message) values (?,?,?)', [socket.user.id, item.user.id, data.msg])
                }
            })
        })
        socket.on(WebSocketType.PrivateRead, async (data) => {
            await pool.query('update private set to_read=1 where from_id=? and to_id=?', [Number(data.to), Number(socket.user.id)])
        })

        socket.on(WebSocketType.WorldRead, async (data) => {
            await pool.query('update world set read_list=concat(read_list,?) where from_id!=? and read_list not like ?', [`${data.user},`, data.user, `%${data.user}%`])
        })

        socket.on('disconnect', () => {
            changeList(io)
        })
    })
}

const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4,
    PrivateRead: 5,
    WorldItem: 6,
    WorldRead: 7
}

function createMessage(user, data, avatar, id) {
    return {
        user,
        data,
        avatar,
        id
    }
}

async function changeList(io) {
    const data = []
    const users = Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)
    for (let item of users) {
        for (let user of users) {
            if (item.id === user.id) {
                data.push({
                    avatar: user.avatar,
                    username: user.username,
                    id: user.id,
                    unread: 0,
                    to: item.id,
                    last: ''
                })
            }

            else {
                let res = await pool.query('select * from private where from_id=? and to_id=? and to_read=0', [user.id, item.id])
                let msg = res[0]
                data.push({
                    avatar: user.avatar,
                    username: user.username,
                    id: String(user.id),
                    unread: msg.length,
                    to: item.id,
                    last: msg.length === 0 ? '' : msg[msg.length - 1]?.message
                })
            }
        }
    }
    io.sockets.emit(WebSocketType.GroupList, createMessage('system', data))
}

module.exports = start