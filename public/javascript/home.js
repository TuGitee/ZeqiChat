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
    let time = +new Date();
    let timeList = [];
    let pageDelta = 0;
    let pageNo = 0;
    let changeFlag = false;
    let messageFlag = false;

    hljs.configure({
        ignoreUnescapedHTML: true
    });

    input.addEventListener('input', () => {
        input.parentNode.style.height = 'auto';
        if (input.parentNode.offsetHeight < 80) input.parentNode.style.height = '80px';
        input.parentNode.style.height = input.scrollHeight + 'px';
        contentList.scrollTop = contentList.scrollHeight;
    })

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
        localStorage.removeItem('avatar');
        localStorage.removeItem('user');
        location.href = '/login';
    })

    const worldItem = { id: WorldID, avatar: '/images/world.jpg', username: 'World', unread: 0 }

    server.on(WebSocketType.WorldItem, (data) => {
        worldItem.unread = data.data[0].unread;
    })

    server.on(WebSocketType.GroupList, (data) => {
        let res = data.data
        res = res.filter(item => Number(item.to) === Number(localStorage.getItem('user')))
        for (let i = 0; i < res.length; i++) {
            for (let j = i + 1; j < res.length; j++) {
                if (res[i].id === res[j].id) {
                    res.splice(j, 1);
                    j--;
                }
            }
        }
        onlineList = [worldItem, ...res];
        list.innerHTML = onlineList.map(item => {
            return `<li class="home-list-item" data-value="${item.id}">
            <div class="home-list-item-title">
            <img src="${item.avatar}" alt="" class="home-list-item-title-avatar">
            <span class="home-list-item-title-username inner-data">${removeSlash(item.username)}</span>
            </div>
            <span class="home-list-item-count" style="display: ${item.id === Number(localStorage.getItem('user')) ? 'block' : item.unread ? 'block' : 'none'}">${item.id === Number(localStorage.getItem('user')) ? 'self' : item.unread}</span>
            </li>`
        }
        ).join('')
        formatEveryMessage();
    })

    let bubble = null;
    function bubbleShow(to) {
        if (contentList.scrollHeight - contentList.scrollTop - contentList.clientHeight < 100) {
            contentList.scrollTop = contentList.scrollHeight;
            if (to === WorldID)
                server.emit(WebSocketType.WorldRead);
            else
                server.emit(WebSocketType.PrivateRead, createMessage(null, null, to));
        }
        else if (!bubble) {
            bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = 1;
            contentList.appendChild(bubble);
        } else {
            bubble.innerHTML = parseInt(bull.innerHTML) + 1;
        }
        bubble.onclick = () => {
            contentList.scrollTop = contentList.scrollHeight;
            bubble.remove();
            bubble = null;
            if (to === WorldID)
                server.emit(WebSocketType.WorldRead);
            else
                server.emit(WebSocketType.PrivateRead, createMessage(null, null, to));
        }
        contentList.addEventListener('scroll', () => {
            if (contentList.scrollHeight - contentList.scrollTop - contentList.clientHeight < 10) {
                bubble?.remove();
                bubble = null;
            }
        })
    }
    server.on(WebSocketType.GroupChat, (item) => {
        if (to === item.id) {
            if (Math.abs(item.time - time) > 1000 * 60 * 5) {
                const time = document.createElement('div');
                time.className = 'home-content-content-item__time';
                time.innerHTML = formatTime(item.time);
                contentList.appendChild(time);
            }
            const div = document.createElement('div');
            div.className = 'home-content-content-item home-content-content-item__other';
            div.innerHTML = `
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(item.user)}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(item.data)}</div></div></div>
                    `
            contentList.appendChild(div);
            time = +new Date();
            const inners = div.querySelectorAll('.inner-data')
            for (let i = 0; i < inners.length; i++) {
                formatMessage(inners[i]);
            }
            pageDelta++;
            bubbleShow(to);
        } else {
            worldItem.unread = parseInt(worldItem.unread) + 1;
            list.children[0].querySelector('.home-list-item-count').style.display = 'block';
            list.children[0].querySelector('.home-list-item-count').innerHTML = worldItem.unread;
        }

    })

    server.on(WebSocketType.PrivateChat, (item) => {
        if (to === item.id && item.id !== localStorage.getItem('user')) {
            if (Math.abs(item.time - time) > 1000 * 60 * 5) {
                const time = document.createElement('div');
                time.className = 'home-content-content-item__time';
                time.innerHTML = formatTime(item.time);
                contentList.appendChild(time);
            }
            const div = document.createElement('div');
            div.className = 'home-content-content-item home-content-content-item__other';
            div.innerHTML = `
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(item.user)}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(item.data)}</div></div></div>
                    `
            contentList.appendChild(div);
            time = +new Date();
            const inners = div.querySelectorAll('.inner-data')
            for (let i = 0; i < inners.length; i++) {
                formatMessage(inners[i]);
            }
            pageDelta++;
            bubbleShow(to);
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
        if (removeSlash(input.value.trim()) === '' || to === '') {
            input.value = '';
            return;
        }
        if (to === WorldID) {
            server.emit(WebSocketType.GroupChat, createMessage(null, input.value));
        }
        else {
            server.emit(WebSocketType.PrivateChat, createMessage(null, input.value, to));
        }

        if (Math.abs(new Date() - time) > 1000 * 60 * 5) {
            const time = document.createElement('div');
            time.className = 'home-content-content-item__time';
            time.innerHTML = formatTime()
            contentList.appendChild(time);
        }
        const div = document.createElement('div');
        div.className = 'home-content-content-item home-content-content-item__me';
        div.innerHTML = `
                <img src="${localStorage.getItem('avatar')}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(localStorage.getItem('username'))}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(input.value)}</div></div></div>
                `
        contentList.appendChild(div);
        time = +new Date();
        timeList.push(time);
        const inners = div.querySelectorAll('.inner-data')
        for (let i = 0; i < inners.length; i++) {
            formatMessage(inners[i]);
        }
        contentList.scrollTop = contentList.scrollHeight;
        input.value = '';
        pageDelta++;
    }

    input.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            let start = input.selectionStart;
            let end = input.selectionEnd;
            let text = input.value;
            input.value = text.substring(0, start) + '\n' + text.substring(end);
            input.selectionStart = input.selectionEnd = start + 1;
            input.scrollTop = input.scrollHeight;
            input.dispatchEvent(new Event('input'));
        }
        else if (e.key === 'Enter') {
            e.preventDefault()
            send.click();
            input.dispatchEvent(new Event('input'));
        } else if(e.key==='Tab'){
            e.preventDefault();
            let start = input.selectionStart;
            let end = input.selectionEnd;
            let text = input.value;
            input.value = text.substring(0, start) + '    ' + text.substring(end);
            input.selectionStart = input.selectionEnd = start + 4;
            input.scrollTop = input.scrollHeight;
        }
    })

    const homeContent = document.querySelector('.home-content')

    document.querySelector('#back').addEventListener('click', () => {
        homeContent.classList.remove('home-content__show');
        to = -1;
        title.innerHTML = 'Chat';
    })

    function changeAvatar() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-content-title">更改信息</div>
                <div class="dialog-content-body">
                    <div class="dialog-content-body-item">
                        <div class="dialog-content-body-item-title">头像</div>
                        <div class="dialog-content-body-item-content">  
                            <div class="dialog-content-body-item-content-avatar">
                                <img src="${localStorage.getItem('avatar')}" alt="" class="dialog-content-body-item-content-avatar-img">
                            </div>
                            <div class="dialog-content-body-item-content-file">
                                <input type="file" id="file" accept="image/*" class="dialog-content-body-item-content-file-input">
                                <label for="file" class="dialog-content-body-item-content-file-label">选择图片</label>
                            </div>
                        </div>
                    </div>
                    <div class="dialog-content-body-item">

                        <div class="dialog-content-body-item-title">用户名</div>
                        <div class="dialog-content-body-item-content">
                            <input type="text" class="dialog-content-body-item-content-input" value="${localStorage.getItem('username')}">
                        </div>
                    </div>
                </div>
                <div class="dialog-content-footer">
                    <div class="dialog-content-footer-btn dialog-content-footer-btn__cancel">取消</div>
                    <div class="dialog-content-footer-btn dialog-content-footer-btn__confirm">确定</div>
                </div>
            </div>
            <div class="box" style="display:none">
            <span>修改信息中...</span>
            <div class="loader">
  <div class="loader__bar"></div>
  <div class="loader__bar"></div>
  <div class="loader__bar"></div>
  <div class="loader__bar"></div>
  <div class="loader__bar"></div>
  <div class="loader__ball"></div>
</div>
</div>
        `
        document.body.appendChild(dialog);

        const file = dialog.querySelector('#file');
        const img = dialog.querySelector('.dialog-content-body-item-content-avatar-img');
        const input = dialog.querySelector('.dialog-content-body-item-content-input');
        const box = dialog.querySelector('.box');
        file.onchange = () => {
            const avatar = file.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(avatar);
            reader.onload = (e) => {
                img.src = e.target.result;
            }
        }
        dialog.querySelector('.dialog-content-footer-btn__cancel').addEventListener('click', () => {
            box.style.display = 'none';
            dialog.remove();
        })
        dialog.querySelector('.dialog-content-footer-btn__confirm').addEventListener('click', async () => {
            box.style.display = 'flex';
            const formdata = new FormData();
            formdata.append('token', localStorage.getItem('token'));
            formdata.append('username', input.value);
            formdata.append('avatar', file.files[0]);
            let res = await axios.put('/api/user', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.ok) {
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('avatar', res.data.avatar);
                localStorage.setItem('token', res.data.newToken);
                box.style.display = 'none';
                dialog.remove();
                location.reload();
            } else {
                alert(res.data.msg);
                location.href = '/login';
            }
        })

    }

    list.addEventListener('click', async (e) => {
        let stemp = to;
        let target = e.target.tagName === 'LI' ? e.target : e.target.parentNode.tagName === 'LI' ? e.target.parentNode : e.target.parentNode.parentNode;
        to = target.getAttribute('data-value');
        if (to === null) return;
        if (stemp === to && to === localStorage.getItem('user')) {
            changeAvatar();
            return;
        }
        if (stemp === to) return;
        timeList = [];
        pageDelta = 0;
        pageNo = 0;
        messageFlag = false;

        if (window.innerWidth < 600) {
            homeContent.classList.add('home-content__show');
        }

        title.innerHTML = target.querySelector('.home-list-item-title-username').innerHTML;
        if (target.querySelector('.home-list-item-count').innerHTML !== 'self') {
            target.querySelector('.home-list-item-count').style.display = 'none';
            target.querySelector('.home-list-item-count').innerHTML = '';
        }

        time = +new Date();
        changeFlag = true;
        contentList.innerHTML = '';
        if (to === WorldID) {
            server.emit(WebSocketType.WorldRead);
            await getWorldData();
        }
        else {
            server.emit(WebSocketType.PrivateRead, createMessage(null, null, to));
            await getPrivateData();
        }
        contentList.scrollTop = contentList.scrollHeight;
    })

    async function getWorldData() {
        await axios.get(`/api/chat/world?pageNo=${pageNo}&pageDelta=${pageDelta}`).then(res => {
            if (!res.data.ok) {
                messageFlag = true;
                return;
            }
            pageNo++;
            const data = res.data.msg;
            let com = []
            let msg = data.map(item => {
                let delta = +new Date(item.create_time) - time;
                time = +new Date(item.create_time);
                com.push(time);
                return `
            ${Math.abs(delta) > 1000 * 60 * 5 ? `<div class="home-content-content-item__time">${formatTime(item.create_time)}</div>` : ''}
            <div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(item.username)}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(item.message)}</div></div></div>
                </div>`}).join('');
            contentList.innerHTML = changeFlag ? msg : msg + contentList.innerHTML;
            timeList = [...com, ...timeList];
            changeFlag = false;
            formatEveryMessage()
        })
    }

    async function getPrivateData() {
        await axios.get(`/api/chat/private?from=${localStorage.getItem('token')}&to=${to}&pageNo=${pageNo}&pageDelta=${pageDelta}`).then(res => {
            if (!res.data.ok) {
                messageFlag = true;
                return;
            }
            pageNo++;
            const data = res.data.msg;
            let com = [];
            const msg = data.map(item => {
                let delta = +new Date(item.create_time) - time;
                time = +new Date(item.create_time);
                com.push(time);
                return `
                ${Math.abs(delta) > 1000 * 60 * 5 ? `<div class="home-content-content-item__time">${formatTime(item.create_time)}</div>` : ''}
                <div class="home-content-content-item home-content-content-item__${localStorage.getItem('username') === item.username ? 'me' : 'other'}">
                    <img src="${item.avatar}" alt="" class="home-content-content-item-avatar">
                    <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(item.username)}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(item.message)}</div></div></div>
                    </div>`}).join('');
            contentList.innerHTML = changeFlag ? msg : msg + contentList.innerHTML;
            timeList = [...com, ...timeList];
            changeFlag = false;
            formatEveryMessage()
        })
    }

    async function init() {

        server.emit(WebSocketType.GroupList);
        server.emit(WebSocketType.WorldItem, createMessage(localStorage.getItem('user')));

        document.querySelector('.border-hello').textContent = `你好, ${localStorage.getItem('username')}`;
        if (window.innerWidth < 600) {
            to = -1;
            title.innerHTML = 'Chat';
            return;
        }

        to = WorldID
        title.innerHTML = 'World';
        await getWorldData();
        server.emit(WebSocketType.WorldRead);
        initFlag = false;

        contentList.scrollTop = contentList.scrollHeight;
        toBottom()
    }

    let scrollFlag = false;
    contentList.addEventListener('scroll', async (e) => {
        if (scrollFlag) return;
        if (messageFlag) {
            scrollFlag = true;
            let div = document.createElement('div')
            div.className = 'home-content-content-item__time'
            div.innerHTML = '消息到底了，快去和TA聊天吧！'
            div.style.padding = '0'
            div.style.maxHeight = '0'
            div.style.opacity = '0'
            setTimeout(() => {
                div.style.maxHeight = '40px'
                div.style.opacity = '1'
            }, 0)
            contentList.insertBefore(div, contentList.firstChild)
            setTimeout(() => {
                div.style.maxHeight = '0'
                div.style.opacity = '0'
                setTimeout(() => {
                    if (div) div.remove()
                    scrollFlag = false;
                }, 500)
            }, 2000)
        } else if (e.target.scrollTop === 0 && !changeFlag) {
            const bottom = contentList.scrollHeight - contentList.scrollTop;
            if (to === WorldID) {
                await getWorldData();
            } else {
                await getPrivateData();
            }
            contentList.scrollTop = contentList.scrollHeight - bottom;
        }


    })

    init()

    let flag = false;
    contentList.addEventListener('click', async (e) => {
        const index = Array.from(contentList.querySelectorAll('.home-content-content-item')).indexOf(e.target);
        if (index === -1) return;

        if (flag) return;
        flag = true;

        const time = timeList[index];
        const span = document.createElement('sapn');
        span.innerHTML = formatTime(time);

        span.style.color = '#999';
        span.style.fontSize = '12px';
        span.style.transition = 'all 0.3s linear';
        span.style.marginTop = '5px';
        span.style.maxHeight = '0';

        e.target.querySelector('.home-content-content-item-msg').appendChild(span);

        await new Promise((resolve) => {
            setTimeout(() => {
                span.style.maxHeight = '20px';
                span.style.opacity = '1';
                resolve();
            }, 0)
        }).then(() => {
            setTimeout(() => {
                span.style.opacity = '0';
                span.style.maxHeight = '0';
                setTimeout(() => {
                    span.remove();
                    flag = false;
                }, 300);
            }, 700);
        })
    })

    document.addEventListener('dragover', (e) => {
        document.querySelector('.home-content-image').classList.add('active');
        e.preventDefault();
    })

    document.addEventListener('dragleave', (e) => {
        document.querySelector('.home-content-image').classList.remove('active');
        e.preventDefault();
    })

    function uploadImage(file) {
        if (!file) return;
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型!");
            document.querySelector('.home-content-image').classList.remove('active');
            document.querySelector('#chat-image').value = '';
            return;
        }
        if (file.size > 200 * 1024) {
            alert("图片大小不得超过200KB! 请压缩图片! ");
            document.querySelector('.home-content-image').classList.remove('active');
            document.querySelector('#chat-image').value = '';
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'upload-image'
            div.innerHTML = `
        <div class="upload-image-content">
            <div class="upload-image-content-title">发送图片</div>
            <div class="upload-image-content-msg">你确定要发送文件吗？（图片大小不得超过200KB）</div>
            <div class="upload-image-content-image"><img src="${e.target.result}"></div>
            <div class="upload-image-content-btns">
                <button class="upload-image-content-btns-cancel">取消</button>
                <button class="upload-image-content-btns-confirm">确定</button>
            </div>
        </div>
        `
            document.body.appendChild(div);
            const cancel = div.querySelector('.upload-image-content-btns-cancel');
            const confirm = div.querySelector('.upload-image-content-btns-confirm');
            cancel.addEventListener('click', () => {
                div.remove();
            })
            confirm.addEventListener('click', () => {
                div.remove();
                const formData = new FormData();
                formData.append('image', file);
                axios.post('/api/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    if (to === WorldID) {
                        server.emit(WebSocketType.GroupChat, createMessage(null, `<img src="${res.data.image}"/>`));
                    }
                    else {
                        server.emit(WebSocketType.PrivateChat, createMessage(null, `<img src="${res.data.image}"/>`, to));
                    }
                    if (Math.abs(new Date() - time) > 1000 * 60 * 5) {
                        const time = document.createElement('div');
                        time.className = 'home-content-content-item__time';
                        time.innerHTML = formatTime()
                        contentList.appendChild(time);
                    }
                    const div = document.createElement('div');
                    div.className = 'home-content-content-item home-content-content-item__me';
                    div.innerHTML = `
                            <img src="${localStorage.getItem('avatar')}" alt="" class="home-content-content-item-avatar">
                            <div class="home-content-content-item-msg"><div class="home-content-content-item-msg-username inner-data">${removeSlash(localStorage.getItem('username'))}</div><div class="home-content-content-item-msg-content"><div class="inner-data">${removeSlash(`<img src="${res.data.image}">`)}</div></div></div>
                            `
                    contentList.appendChild(div);
                    time = +new Date();
                    timeList.push(time);
                    const inners = div.querySelectorAll('.inner-data')
                    for (let i = 0; i < inners.length; i++) {
                        formatMessage(inners[i]);
                    }
                    contentList.scrollTop = contentList.scrollHeight;
                    pageDelta++;
                })
            })
        }
        document.querySelector('.home-content-image').classList.remove('active');
    }

    async function toBottom() {
        await new Promise((resolve) => {
            let imgList = document.querySelectorAll('img');
            let videoList = document.querySelectorAll('video');
            let count = 0;
            let total = imgList.length + videoList.length;
            if (total === 0) {
                resolve();
                return;
            }
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].onload = () => {
                    count++;
                    if (count === total) {
                        resolve();
                    }
                }
            }
            for (let i = 0; i < videoList.length; i++) {
                videoList[i].onloadeddata = () => {
                    count++;
                    if (count === total) {
                        resolve();
                    }
                }
            }
        })
        contentList.scrollTop = contentList.scrollHeight;
    }

    document.querySelector('#chat-image').addEventListener('change', () => {
        const file = document.querySelector('#chat-image').files[0];
        uploadImage(file);
    })
}

function formatTime(time) {
    const date = time ? new Date(time) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 不足两位补0
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();

    if (year === nowYear && month === nowMonth && day === nowDay) {
        return '今天' + ' ' + [hour, minute, second].join(':');;
    } else if (year === nowYear && month === nowMonth && day === nowDay - 1) {
        return '昨天' + ' ' + [hour, minute, second].join(':');;
    } else if (year === nowYear && month === nowMonth && day === nowDay - 2) {
        return '前天' + ' ' + [hour, minute, second].join(':');;
    }

    return [year, month, day].join('/') + ' ' + [hour, minute, second].join(':');
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