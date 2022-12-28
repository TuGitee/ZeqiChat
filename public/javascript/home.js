window.onload = () => {
    const WorldID = 'World';
    const server = io(`ws://localhost:8080?token=${localStorage.getItem('token')}`);
    const input = document.querySelector('#chat-input');
    const list = document.querySelector('.home-list');
    const send = document.querySelector('#chat-send');
    const contentList = document.querySelector('#chat-content');
    contentList.innerHTML = '<h1>即刻聊天</h1><p>即刻聊天是一个即时聊天的应用</p><p>你可以和任何在线的人聊天，也可以和世界聊天</p><p>你可以在左侧的列表中选择你想聊天的人</p><p>在下方的输入框中输入你想说的话</p><p>点击发送按钮发送你的消息</p><p>我们承诺不会对你的发言进行任何的记录</p><p>你可以随时退出</p>';
    const title = document.querySelector('.home-content-title');
    title.querySelector('.home-content-title-name').innerHTML = `Hello, ${localStorage.getItem('username')}<br>
    Chat to Anyone You Want`;
    let to = '';

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

    server.emit(WebSocketType.GroupList);

    server.on(WebSocketType.GroupList, (data) => {
        data = data.data;
        list.innerHTML = `<li class="home-list-item" data-value="${WorldID}"><img src="/images/world.jpg" alt="" class="home-list-item-avatar">
        <span class="home-list-item-username">World</span></li>` + data.map(item => `<li class="home-list-item" data-value="${item.id}">
        <img src="${item.avatar}" alt="" class="home-list-item-avatar">
        <span class="home-list-item-username">${item.username}</span>
        </li>`).join('')
    })

    server.on(WebSocketType.GroupChat, (item) => {
        if (to === item.id) {
            contentList.innerHTML += `<div class="home-content-content-item">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg">${item.data}</div>
                </div>`
            contentList.scrollTop = contentList.scrollHeight;
        }
    })

    server.on(WebSocketType.PrivateChat, (item) => {
        if (to === item.id) {
            contentList.innerHTML += `<div class="home-content-content-item">
            <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
            <div class="home-content-content-item-msg">${item.data}</div>
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
        if (to !== localStorage.getItem('user'))
            contentList.innerHTML += `<div class="home-content-content-item">
                <img src="${localStorage.getItem('avatar')}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg">${input.value}</div>
                </div>`
        contentList.scrollTop = contentList.scrollHeight;
        input.value = '';
    }

    document.onkeydown = (e) => {
        if (e.key === 'Enter') {
            send.click();
        }
    }


    list.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LI') return;
        to = e.target.getAttribute('data-value');
        const username = e.target.querySelector('.home-list-item-username').innerHTML;
        title.innerHTML = `Chat to ${username}`;

        if (to === WorldID) {
            axios.get('/api/chat/world').then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="home-content-content-item">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg">${item.message}</div>
                </div>`).join('')
            })
        }

        else {
            axios.get(`/api/chat/private?from=${localStorage.getItem('user')}&to=${to}`).then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="home-content-content-item">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg">${item.message}</div>
                </div>`).join('')
            })
        }

    }
    )



    function createMessage(user, msg, to) {
        return {
            user,
            msg,
            to
        }
    }

}

const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4
}