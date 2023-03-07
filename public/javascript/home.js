window.onload = () => {
    const ip = location.hostname;
    const WorldID = 'd29ybGQ=';
    const server = io(`ws://${ip}:8080?token=${localStorage.getItem('token')}`);
    const input = document.querySelector('#chat-input');
    const list = document.querySelector('.home-list');
    const onlineUser = [];
    const send = document.querySelector('#chat-send');
    const contentList = document.querySelector('#chat-content');
    const title = document.querySelector('.home-content-title-name');
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
        data.map(item=>{
            if(onlineUser.map(item=>item.id).indexOf(item.id) === -1){
                onlineUser.push(item);
            }
        })
        list.innerHTML = `<li class="home-list-item" data-value="${WorldID}"><img src="/images/world.jpg" alt="" class="home-list-item-avatar">
            <span class="home-list-item-username">World</span></li>` + onlineUser.map(item => `<li class="home-list-item" data-value="${item.id}">
            <img src="${item.avatar}" alt="" class="home-list-item-avatar">
            <span class="home-list-item-username">${item.username}</span>
            </li>`).join('')
    })

    server.on(WebSocketType.GroupChat, (item) => {
        if (to === item.id) {
            contentList.innerHTML += `<div class="home-content-content-item home-content-content-item__other">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.user}</div><div class="home-content-content-item-msg-content">${item.data}</div></div>
                    </div>`
            contentList.scrollTop = contentList.scrollHeight;
        }
    })

    server.on(WebSocketType.PrivateChat, (item) => {
        if (to === item.id && item.id !== localStorage.getItem('user')) {
            contentList.innerHTML += `<div class="home-content-content-item home-content-content-item__other">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.user}</div><div class="home-content-content-item-msg-content">${item.data}</div></div>
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
        contentList.innerHTML += `<div class="home-content-content-item home-content-content-item__me">
                    <img src="${localStorage.getItem('avatar')}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${localStorage.getItem('username')}</div><div class="home-content-content-item-msg-content">${input.value}</div></div>
                    </div>`
        contentList.scrollTop = contentList.scrollHeight;
        input.value = '';
    }

    document.onkeydown = (e) => {
        if (e.key === 'Enter') {
            send.click();
        }
    }

    list.addEventListener('click', async (e) => {
        if (window.innerWidth < 600) {
            location.href = `/chat?to=${e.target.getAttribute('data-value')}&username=${e.target.querySelector('.home-list-item-username').innerHTML}`;
            return;
        }

        if (e.target.tagName !== 'LI') return;
        to = e.target.getAttribute('data-value');
        const username = e.target.querySelector('.home-list-item-username').innerHTML;
        title.innerHTML = username;

        if (to === WorldID) {
            await axios.get('/api/chat/world').then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.username}</div><div class="home-content-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
            })
        }

        else {
            await axios.get(`/api/chat/private?from=${localStorage.getItem('user')}&to=${to}`).then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.username}</div><div class="home-content-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
            })
        }
        contentList.scrollTop = contentList.scrollHeight;

    })

    async function init() {
        to = WorldID
        title.innerHTML = 'World';

        await axios.get('/api/chat/world').then(res => {
            const data = res.data.msg;
            contentList.innerHTML = data.map(item => `<div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.username}</div><div class="home-content-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
        })

        contentList.scrollTop = contentList.scrollHeight;
    }

    init()

}


function createMessage(user, msg, to) {
    return {
        user,
        msg,
        to
    }
}


const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4
}