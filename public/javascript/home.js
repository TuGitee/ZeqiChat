window.onload = () => {
    const ip = location.hostname;
    const WorldID = 'd29ybGQ=';
    const server = io(`ws://${ip}:8080?token=${localStorage.getItem('token')}`);
    const input = document.querySelector('#chat-input');
    const list = document.querySelector('.home-list');
    const send = document.querySelector('#chat-send');
    const contentList = document.querySelector('#chat-content');
    const title = document.querySelector('.home-content-title-name');
    title.innerHTML = 'World';
    let to = '';
    let onlineList = [];


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



    const worldItem = { id: WorldID, avatar: '/images/world.jpg', username: 'World', unread: 0 }

    server.on(WebSocketType.WorldItem, (data) => {
        let user = JSON.parse(localStorage.getItem('user'));
        let d = data.data.filter(item => Number(item.to) === Number(user))
        worldItem.unread = d[0].unread;
    })

    server.on(WebSocketType.GroupList, async (data) => {
        let user = JSON.parse(localStorage.getItem('user'));
        onlineList = [worldItem, ...data.data.filter(item => Number(item.to) === Number(user))];
        list.innerHTML = onlineList.map(item => {
            return `<li class="home-list-item" data-value="${item.id}">
            <div class="home-list-item-title">
            <img src="${item.avatar}" alt="" class="home-list-item-title-avatar">
            <span class="home-list-item-title-username">${item.username}</span>
            </div>
            <span class="home-list-item-count" style="display: ${item.unread ? 'block' : 'none'}">${item.unread}</span>
            </li>`
        }
        ).join('')
    })

    server.on(WebSocketType.GroupChat, (item) => {
        if (to === item.id) {
            contentList.innerHTML += `<div class="home-content-content-item home-content-content-item__other">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.user}</div><div class="home-content-content-item-msg-content">${item.data}</div></div>
                    </div>`
            contentList.scrollTop = contentList.scrollHeight;
        } else {
            list.children[0].querySelector('.home-list-item-count').style.display = 'block';
            console.log(parseInt(list.children[0].querySelector('.home-list-item-count').innerHTML === '' ? 0 : list.children[0].querySelector('.home-list-item-count').innerHTML))
            list.children[0].querySelector('.home-list-item-count').innerHTML = parseInt(list.children[0].querySelector('.home-list-item-count').innerHTML === '' || list.children[0].querySelector('.home-list-item-count').innerHTML === 'undefined' || list.children[0].querySelector('.home-list-item-count').innerHTML === 'null' ? 0 : list.children[0].querySelector('.home-list-item-count').innerHTML) + 1;
        }
    })

    server.on(WebSocketType.PrivateChat, (item) => {
        if (to === item.id && item.id !== localStorage.getItem('user')) {
            contentList.innerHTML += `<div class="home-content-content-item home-content-content-item__other">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.user}</div><div class="home-content-content-item-msg-content">${item.data}</div></div>
                </div>`
            contentList.scrollTop = contentList.scrollHeight;
        } else if (item.id === localStorage.getItem('user')) {
            return;
        } else {
            for (let i = 0; i < list.children.length; i++) {
                if (list.children[i].getAttribute('data-value') === item.id) {
                    list.children[i].querySelector('.home-list-item-count').style.display = 'block';
                    list.children[i].querySelector('.home-list-item-count').innerHTML = parseInt(list.children[i].querySelector('.home-list-item-count').innerHTML.trim() === '' ? 0 : list.children[i].querySelector('.home-list-item-count').innerHTML) + 1;
                    break;
                }
            }
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
        let target = e.target.tagName === 'LI' ? e.target : e.target.parentNode;
        to = target.getAttribute('data-value');

        if (window.innerWidth < 600) {
            if (to === WorldID)
                server.emit(WebSocketType.WorldRead, createMessage(localStorage.getItem('user')));
            else server.emit(WebSocketType.PrivateRead, createMessage(localStorage.getItem('user'), '', to));

            location.href = `/chat?to=${target.getAttribute('data-value')}&username=${target.querySelector('.home-list-item-title-username').innerHTML}`;
            return;
        }

        title.innerHTML = e.target.querySelector('.home-list-item-title-username').innerHTML;
        target.querySelector('.home-list-item-count').style.display = 'none';
        target.querySelector('.home-list-item-count').innerHTML = '';

        if (to === WorldID) {
            server.emit(WebSocketType.WorldRead, createMessage(localStorage.getItem('user')));
            await axios.get('/api/chat/world').then(res => {
                const data = res.data.msg;
                contentList.innerHTML = data.map(item => `<div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username">${item.username}</div><div class="home-content-content-item-msg-content">${item.message}</div></div>
                    </div>`).join('')
            })
        }

        else {
            server.emit(WebSocketType.PrivateRead, createMessage(localStorage.getItem('user'), '', to));
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

    server.emit(WebSocketType.GroupList);
    server.emit(WebSocketType.WorldItem, createMessage(localStorage.getItem('user')));

    async function init() {
        if (window.innerWidth < 600) {
            to = -1;
            title.innerHTML = 'Chat';
            return;
        }

        to = WorldID
        title.innerHTML = 'World';

        server.emit(WebSocketType.WorldRead, createMessage(localStorage.getItem('user')));

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


function createMessage(user, msg, to, id) {
    return {
        user,
        msg,
        to,
        id
    }
}


const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4,
    PrivateRead: 5,
    WorldItem: 6,
    WorldRead: 7,
}