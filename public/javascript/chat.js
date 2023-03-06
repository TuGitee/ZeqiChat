window.onload = () => {

    const ip = location.hostname;
    const WorldID = 'd29ybGQ=';
    const server = io(`ws://${ip}:8080?token=${localStorage.getItem('token')}`);

    const input = document.querySelector('#chat-input');
    const list = document.querySelector('.home-list');
    const send = document.querySelector('#chat-send');
    const contentList = document.querySelector('#chat-content');
    const title = document.querySelector('.chat-title-name');
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    const logout = document.querySelector('#logout');

    logout.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('avatar');
        localStorage.removeItem('user');
        location.href = '/login';
    }

    server.on(WebSocketType.System, (data) => {
        console.log(data);
    })

    server.on(WebSocketType.Error, (data) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        location.href = '/login';
    })

    server.on(WebSocketType.GroupChat, (item) => {
        if (to === item.id) {
            contentList.innerHTML += `<div class="chat-content-item chat-content-item__other">
                <img src="${item.avatar}" alt="" class="chat-content-item-avatar">
                <div class="chat-content-item-msg"><div class="chat-content-item-msg-username">${item.user}</div><div class="chat-content-item-msg-content">${item.data}</div></div>
                </div>`
            contentList.scrollTop = contentList.scrollHeight;
        }
    })

    server.on(WebSocketType.PrivateChat, (item) => {
        if (to === item.id && item.id !== localStorage.getItem('user')) {
            contentList.innerHTML += `<div class="chat-content-item chat-content-item__other">
            <img src="${item.avatar}" alt="" class="chat-content-item-avatar">
            <div class="chat-content-item-msg"><div class="chat-content-item-msg-username">${item.user}</div><div class="chat-content-item-msg-content">${item.data}</div></div>
            </div>`
            contentList.scrollTop = contentList.scrollHeight;
        }
    })


    send.onclick = () => {
        if (input.value.trim() === '' || to === '') {
            input.value = '';
            return;
        }
        if (to === WorldID) {
            server.emit(WebSocketType.GroupChat, createMessage(localStorage.getItem('username'), input.value));
        }
        else {
            server.emit(WebSocketType.PrivateChat, createMessage(localStorage.getItem('username'), input.value, to));
        }
        contentList.innerHTML += `<div class="chat-content-item chat-content-item__me">
                <img src="${localStorage.getItem('avatar')}" alt="" class="chat-content-item-avatar">
                <div class="chat-content-item-msg"><div class="chat-content-item-msg-username">${localStorage.getItem('username')}</div><div class="chat-content-item-msg-content">${input.value}</div></div>
                </div>`
        contentList.scrollTop = contentList.scrollHeight;
        input.value = '';
    }

    document.onkeydown = (e) => {
        if (e.key === 'Enter') {
            send.click();
        }
    }

    async function init() {
        const username = urlParams.get('username');
        title.innerHTML = username;

        if (to === WorldID) {
            await axios.get('/api/chat/world').then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="chat-content-item chat-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="chat-content-item-avatar">
                    <div class="chat-content-item-msg"><div class="chat-content-item-msg-username">${item.username}</div><div class="chat-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
            })
        }

        else {
            await axios.get(`/api/chat/private?from=${localStorage.getItem('user')}&to=${to}`).then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="chat-content-item chat-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="chat-content-item-avatar">
                    <div class="chat-content-item-msg"><div class="chat-content-item-msg-username">${item.username}</div><div class="chat-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
            })
        }
        contentList.scrollTop = contentList.scrollHeight;
    }



    function createMessage(user, msg, to) {
        return {
            user,
            msg,
            to
        }
    }

    init()
}


const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4
}