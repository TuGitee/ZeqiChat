const JWT=require('../utils/JWT');
const pool=require('../config/pool');

const WorldID = 'd29ybGQ=';

function start(server){
    const io=require('socket.io')(server,{cors:true});
    io.on('connect',(socket)=>{
        const payload = JWT.verify(socket.handshake.query.token);
        if (payload) {
            socket.user = payload;
            socket.emit(WebSocketType.System, createMessage('system','hello world!'))
        }else {
            socket.emit(WebSocketType.Error,createMessage('system','token error'))
        }
        socket.on(WebSocketType.GroupList, () => {
            changeList(io)
        })
        socket.on(WebSocketType.GroupChat, (data) => {
            socket.broadcast.emit(WebSocketType.GroupChat, createMessage(data.user, data.msg ,socket.user.avatar,WorldID))
            pool.query('insert into world (from_id,message) values (?,?)',[socket.user.id,data.msg])
        })
        socket.on(WebSocketType.PrivateChat, (data) => {
            io.sockets.sockets.forEach(item => {
                if (item.user.id === Number(data.to)) {
                    item.emit(WebSocketType.PrivateChat, createMessage(data.user, data.msg, socket.user.avatar,String(socket.user.id)))
                    pool.query('insert into private (from_id,to_id,message) values (?,?,?)',[socket.user.id,item.user.id,data.msg])
                }
            })
        })

        socket.on('disconnect',()=>{
            changeList(io)
        })
    })
}

const WebSocketType={
    Error:0,
    GroupList:1,
    GroupChat:2,
    PrivateChat:3,
    System:4
}

function createMessage(user,data,avatar,id){
    return {
        user,
        data,
        avatar,
        id
    }
}

function changeList(io){
    io.sockets.emit(WebSocketType.GroupList, createMessage('system', Array.from(io.sockets.sockets).map(item=>item[1].user).filter(item=>item)))
}

module.exports=start