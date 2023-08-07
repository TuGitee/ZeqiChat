<template>
    <div class="home-content" :class="{ 'home-content__show': to }" ref="box" :style="{ height }">
        <transition name="el-fade-in">
            <Firework :text="text" v-if="isFirework"></Firework>
        </transition>
        <div class=" home-content-title">
            <div class="home-content-title-box">
                <a class="home-content-title-back" id="back" href="javascript:;" v-if="isMobile" @click="goBack"></a>
                <img :src="`http://47.120.2.219:3000${avatar}`" class="home-content-title-img" v-if="avatar" alt="">
                <span class="home-content-title-name" v-html="formatMessage(removeSlash(username))"></span>
            </div>
            <a id="logout" href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="home-content-content" id="chat-content" ref="contentList" @scroll="handleScroll">
            <el-collapse-transition>
                <div class=" home-content-content-item__end" v-if="scrollFlag">{{ "消息到底了，快去和TA聊天吧！" }}
                </div>
            </el-collapse-transition>
            <div class="home-content-content-item__end" v-if="!messageEnd">{{ "消息加载中..." }}
            </div>
            <ChatItem v-for="  msg   in   msgList  " :key="msg.id" :msg="msg"></ChatItem>
            <div class="bubble" v-if="unread_msg" @click="bubbleClick">{{ unread_msg }}</div>
        </div>
        <div class="home-content-input" ref="input">
            <div class="home-content-input-btns">
                <button class="home-content-input-btns__more">
                    <label id="image-send" for="chat-image">+</label>
                </button>
            </div>
            <textarea type="text" id="chat-input" maxlength="1000" rows="1" v-model="input" @keydown="handleKeyDown"
                placeholder="发送信息" @input="fitHeight"></textarea>
            <div class="home-content-input-btns">
                <a href="javascript:;" id="voice" class="home-content-input-btns__voice" @mousedown="recordVoice"
                    @mouseup="sendVoice" @mouseleave="cancelVoice" @touchstart="recordVoice" @touchend="sendVoice"
                    @touchleave="cancelVoice">
                    <svg t="1690709285923" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2312" width="20" height="20">
                        <path d="M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#333333" p-id="2313"></path>
                        <path
                            d="M435.7 282.8a31.9 31.9 0 0 0 0 45.2 257.4 257.4 0 0 1 0 368 32 32 0 1 0 44.9 45.6 321.4 321.4 0 0 0 0-459.2 31.9 31.9 0 0 0-44.9 0.4z"
                            fill="#333333" p-id="2314"></path>
                        <path
                            d="M660.9 105.2a32 32 0 0 0-44.9 45.6 505.2 505.2 0 0 1 0 722.4 32 32 0 1 0 44.9 45.6 569.1 569.1 0 0 0 0-813.6z"
                            fill="#333333" p-id="2315"></path>
                    </svg>
                </a>
            </div>
            <div class="home-content-input-btns">
                <button id="chat-send" @touchstart.prevent="send" @mousedown="send">发送</button>
            </div>
        </div>
        <div class="home-content-image" :class="{ active: isDrag }">
            <input type="file" id="chat-image" accept="image/*" @change="uploadImage" ref="upload" />
        </div>
        <ChangeAvatar v-if="isChangeAvatar" @cancel="cancel"></ChangeAvatar>
        <Upload v-if="file" @cancel="cancelUpload" :url="url" @confirm="confirmUpload"></Upload>
    </div>
</template>

<script>
import ChangeAvatar from '../ChangeAvatar';
import Upload from '../Upload';
import ChatItem from "./ChatItem";
import { removeSlash, formatMessage } from "@/utils/message";
import MonitorKeyboard from '@/utils/MonitorKeyboard.js';
import { WebSocketType } from "@/ws/index";
export default {
    name: 'Chat',
    components: {
        ChangeAvatar,
        Upload,
        ChatItem
    },
    props: {
        server: {
            type: Object
        },
        isDrag: {
            type: Boolean,
            default: false
        },
        isChangeAvatar: {
            type: Boolean,
            default: false
        },
        unread_msg: {
            type: Number,
            default: 0
        },
        onlineList: {
            type: Array,
            default: () => []
        },
        friendList: {
            type: Array,
            default: () => []
        },
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            msgList: [],
            input: '',
            messageEnd: false,
            scrollFlag: false,
            isRequestData: false,
            preHeight: null,
            WorldID: 2023,
            file: null,
            pageDelta: 0,
            pageNo: 0,
            avatar: null,
            username: 'Loading...',
            version: 2,
            height: '100%',
            timer: null,
            mediaRecorder: null,
            text: '',
            isFirework: false
        }
    },
    methods: {
        recordVoice() {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            }).then(stream => {
                this.mediaRecorder ?? (this.mediaRecorder = new MediaRecorder(stream));
                this.mediaRecorder.start();

            })
        },
        sendVoice() {
            this.mediaRecorder?.stop();
            this.mediaRecorder.ondataavailable = e => {
                const blob = new Blob([e.data], {
                    type: 'audio/mpeg'
                });

                const formData = new FormData();
                formData.append('audio', blob);

                this.$axios.post(`/api/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    if (this.to == this.WorldID)
                        this.server.emit(WebSocketType.GroupChat, this.createMessage(null, `<audio src="${res.data.audio}"></audio>`));
                    else
                        this.server.emit(WebSocketType.PrivateChat, this.createMessage(null, `<audio src="${res.data.audio}"></audio>`, this.to));

                    this.msgList.push({
                        username: localStorage.getItem("username"),
                        avatar: localStorage.getItem("avatar"),
                        message: `<audio src="${res.data.audio}"></audio>`,
                        create_time: new Date(),
                        delta: new Date() - new Date(this.msgList[this.msgList.length - 1].create_time)
                    })

                    this.scrollToBottom(this.$refs.contentList);
                    this.pageDelta++;

                    this.mediaRecorder.ondataavailable = null
                });

            }
        },
        cancelVoice() {
            this.mediaRecorder?.stop();
        },
        getKeyboardState() {
            this.monitorKeyboard = new MonitorKeyboard();
            this.monitorKeyboard.onStart();
            this.monitorKeyboard.onShow(() => { })
            this.monitorKeyboard.onHidden(() => { })
        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("avatar");
            localStorage.removeItem("user");
            this.server.close();
            this.$router.push('/login')
        },
        async handleScroll(e) {
            if (
                e.target.scrollHeight -
                e.target.scrollTop -
                e.target.clientHeight <
                10
            ) {
                this.unread_msg = 0;
                if (this.friendList.length)
                    this.friendList.find(user => user.id == this.to).unread = 0;
                if (this.to === this.WorldID) this.server.emit(WebSocketType.WorldRead);
                else
                    this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
            }
            if (this.scrollFlag) return;
            if (this.messageEnd && e.target.scrollTop === 0) {
                this.scrollFlag = true;
                setTimeout(() => {
                    this.scrollFlag = false;
                }, 1000)
            } else if (e.target.scrollTop === 0) {
                const bottom = e.target.scrollHeight - e.target.scrollTop;
                if (this.to === this.WorldID) {
                    await this.getWorldData();
                } else {
                    await this.getPrivateData();
                }
                e.target.scrollTop = e.target.scrollHeight - bottom;
            }
        },
        bubbleClick() {
            this.scrollToBottom(this.$refs.contentList);
            this.unread_msg = 0;
            this.friendList.find(user => user.id == this.to).unread = 0;
            if (this.to === this.WorldID) this.server.emit(WebSocketType.WorldRead);
            else
                this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
        },
        goBack() {
            this.$router.replace('/home')
        },
        cancel() {
            this.$emit('cancelChangeAvatar')
        },
        scrollToBottom(dom) {
            this.$nextTick(() => {
                if (dom)
                    dom.scrollTop = dom.scrollHeight;
            })
        },
        fitHeight(e) {
            e = e.target ? e.target : e
            e.parentNode.style.height = "auto";
            if (e.parentNode.offsetHeight < 48)
                e.parentNode.style.height = "48px";
            e.parentNode.style.height = e.scrollHeight + "px";
            if (this.$refs.contentList.scrollTop + this.$refs.contentList.clientHeight + 100 >= this.$refs.contentList.scrollHeight)
                this.scrollToBottom(this.$refs.contentList);
        },
        createMessage(user, msg, to, id) {
            return {
                user,
                msg,
                to,
                id,
            };
        },
        handleKeyDown(e) {
            if (e.ctrlKey && e.key === "Enter" || e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                this.send(e);
            } else if (e.key === "Enter") {
                e.preventDefault();
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                let text = e.target.value;
                this.input = text.substring(0, start) + "\n" + text.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + 1;
            } else if (e.key === "Tab") {
                e.preventDefault();
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                let text = e.target.value;
                this.input = text.substring(0, start) + "    " + text.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }
            this.$nextTick(() => {
                this.fitHeight(e);
            })
        },
        send(e) {
            if (this.input.trim() === "" || this.to === "") {
                this.input = "";
                this.$refs.input.style.height = '48px'
                return;
            }

            if (this.to === this.WorldID) {
                this.server.emit(WebSocketType.GroupChat, this.createMessage(null, this.input));
            } else {
                this.server.emit(
                    WebSocketType.PrivateChat,
                    this.createMessage(null, this.input, this.to)
                );
            }

            const msg = {
                username: localStorage.getItem("username"),
                avatar: localStorage.getItem("avatar"),
                message: this.input,
                create_time: new Date(),
                delta: this.msgList[this.msgList.length - 1] ? new Date() - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity,
            }

            this.msgList.push(msg)
            this.$emit('changeOnlinelist', this.to, msg)

            this.scrollToBottom(this.$refs.contentList);

            this.input = "";

            this.$refs.input.style.height = '48px'
            this.pageDelta++;

        },
        async getWorldData() {
            if (this.isRequestData) return;
            this.isRequestData = true
            await this.$axios
                .get(`/api/chat/world?pageNo=${this.pageNo}&pageDelta=${this.pageDelta}`)
                .then((res) => {
                    if (!res.data.ok) {
                        this.messageEnd = true;
                        return;
                    }
                    const data = res.data.msg;
                    this.msgList.unshift(...data)
                    for (let i = 0; i < Math.min(data.length + 1, this.msgList.length); i++) {
                        if (i === 0)
                            this.msgList[i].delta = Infinity;
                        else
                            this.msgList[i].delta = new Date(this.msgList[i].create_time) - new Date(this.msgList[i - 1].create_time);
                    }
                    this.pageNo++;
                    this.isRequestData = false
                });
        },
        async getPrivateData() {
            if (this.isRequestData) return;
            this.isRequestData = true
            await this.$axios
                .get(
                    `/api/chat/private?from=${this.token}&to=${this.to}&pageNo=${this.pageNo}&pageDelta=${this.pageDelta}`
                )
                .then((res) => {
                    if (!res.data.ok) {
                        this.messageEnd = true;
                        return;
                    }
                    const data = res.data.msg;
                    this.msgList.unshift(...data)
                    for (let i = 0; i < Math.min(data.length + 1, this.msgList.length); i++) {
                        if (i === 0)
                            this.msgList[i].delta = Infinity;
                        else
                            this.msgList[i].delta = new Date(this.msgList[i].create_time) - new Date(this.msgList[i - 1].create_time);
                    }
                    this.pageNo++;
                    this.isRequestData = false
                });
        },
        async toBottom() {
            await new Promise((resolve) => {
                let imgList = document.querySelectorAll("img");
                let videoList = document.querySelectorAll("video");
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
                    };
                }
                for (let i = 0; i < videoList.length; i++) {
                    videoList[i].onloadeddata = () => {
                        count++;
                        if (count === total) {
                            resolve();
                        }
                    };
                }
            });
            this.scrollToBottom(this.$refs.contentList);
        },
        bubbleShow() {
            if (
                this.$refs.contentList.scrollHeight -
                this.$refs.contentList.scrollTop -
                this.$refs.contentList.clientHeight <
                100
            ) {
                this.scrollToBottom(this.$refs.contentList);
                if (this.to === this.WorldID) this.server.emit(WebSocketType.WorldRead);
                else
                    this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
            } else {
                this.unread_msg++;
                this.friendList.find(user => user.id == this.to).unread++;
            }
        },
        async recieveMessage(item) {
            const msg = {
                message: item.data,
                avatar: item.avatar,
                create_time: item.time,
                username: item.user,
            }
            if (this.to == item.id && item.id != this.userId) {
                msg.delta = this.msgList[this.msgList.length - 1] ? new Date(this.msgList[this.msgList.length - 1].create_time) - item.time : Infinity;
                this.msgList.push(msg)
                this.pageDelta++;
                this.bubbleShow(this.to);
            } else if (item.id === this.userId) {
                return;
            } else {
                this.friendList.find(user => user.id == item.id).unread++;
            }

            this.$emit('changeOnlinelist', item.id, msg);

            const db = await this.openDB("chat", this.version);
            const transaction = db.transaction(["info"], "readwrite");
            const objectStore = transaction.objectStore("info");

            const request = objectStore.get(Number(item.id));

            let res = await new Promise((resolve) => {
                request.onsuccess = () => {
                    resolve(request.result);
                }
            })

            if (!!res)
                await new Promise((resolve) => {
                    const request = objectStore.put({
                        id: Number(item.id),
                        msgList: [...res.msgList, msg],
                        pageDelta: res.pageDelta + 1,
                        pageNo: res.pageNo,
                        messageEnd: res.messageEnd,
                        scrollFlag: res.scrollFlag,
                        unread_msg: res.unread_msg,
                        isRequestData: res.isRequestData
                    });

                    request.onsuccess = () => {
                        resolve();
                    }
                })
        },
        uploadImage(e) {
            const file = e.target.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert("请确保文件为图像类型!");
                e.target.value = "";
                return;
            }
            if (file.size > 200 * 1024) {
                alert("图片大小不得超过200KB! 请压缩图片! ");
                e.target.value = "";
                return;
            }
            this.file = file;
        },
        cancelUpload() {
            this.file = null
            this.$refs.upload.value = null
        },
        confirmUpload() {
            const formData = new FormData();
            formData.append("image", this.file);
            this.$axios
                .post("/api/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (this.to === this.WorldID) {
                        this.server.emit(
                            WebSocketType.GroupChat,
                            this.createMessage(null, `<img src="${res.data.image}"/>`)
                        );
                    } else {
                        this.server.emit(
                            WebSocketType.PrivateChat,
                            this.createMessage(null, `<img src="${res.data.image}"/>`, this.to)
                        );
                    }
                    this.msgList.push({
                        username: localStorage.getItem("username"),
                        avatar: localStorage.getItem("avatar"),
                        message: `<img src="${res.data.image}">`,
                        create_time: new Date()
                    })
                    this.scrollToBottom(this.$refs.contentList);
                    this.pageDelta++;
                });
            this.file = null
            this.$refs.upload.value = null
            this.$nextTick(() => {
                this.toBottom();
            })
        },
        async init() {
            const db = await this.openDB("chat", this.version);
            const transaction = db.transaction(["info"], "readwrite");
            const objectStore = transaction.objectStore("info");

            await new Promise((resolve) => {
                const request = objectStore.get(this.to);
                request.onsuccess = (event) => {
                    if (request.result) {
                        this.pageDelta = request.result.pageDelta;
                        this.pageNo = request.result.pageNo;
                        this.msgList = request.result.msgList;
                        this.messageEnd = request.result.messageEnd;
                        this.scrollFlag = request.result.scrollFlag;
                        this.isRequestData = request.result.isRequestData;
                    }
                    else {
                        this.pageDelta = 0;
                        this.pageNo = 0;
                        this.msgList = [];
                        this.messageEnd = false;
                        this.scrollFlag = false;
                        this.isRequestData = false;
                    }
                    if (!this.msgList.length) this.getMessage();

                    resolve();
                }
            })

            this.scrollToBottom(this.$refs.contentList);

            this.avatar = this.friendList.find(user => user.id == this.to)?.avatar
            this.username = this.friendList.find(user => user.id == this.to)?.username

        },
        removeSlash,
        formatMessage,
        async getMessage() {
            if (this.to == this.WorldID) {
                this.server.emit(WebSocketType.WorldRead);
                await this.getWorldData();
            } else {
                this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
                await this.getPrivateData();
            }

            this.scrollToBottom(this.$refs.contentList);
        },
        openDB(dbName, version = 1) {
            return new Promise((resolve, reject) => {
                const indexedDB =
                    window.indexedDB ||
                    window.mozIndexedDB ||
                    window.webkitIndexedDB ||
                    window.msIndexedDB;
                let db;
                const request = indexedDB.open(dbName, version);
                request.onsuccess = function (event) {
                    db = event.target.result;
                    resolve(db);
                };
                request.onerror = function (event) {
                    console.log("数据库打开报错");
                };
                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    if (!db.objectStoreNames.contains("info")) {
                        const objectStore = db.createObjectStore("info", {
                            keyPath: "id",
                        });
                        objectStore.createIndex("id", "id", {
                            unique: true,
                        });
                    }
                };
            })
        },
        async saveInfo(oldVal) {
            const db = await this.openDB("chat", this.version);
            const data = {
                pageDelta: this.pageDelta,
                pageNo: this.pageNo,
                msgList: this.msgList,
                messageEnd: this.messageEnd,
                scrollFlag: this.scrollFlag,
                isRequestData: this.isRequestData,
                id: Number(oldVal),
            }
            const transaction = db.transaction(["info"], "readwrite");
            const objectStore = transaction.objectStore("info");
            try {
                objectStore.put(data);
            } catch (e) { }
        },

    },
    mounted() {
        this.getKeyboardState();

        visualViewport.onresize = () => {
            if (this.isMobile) {
                this.height = visualViewport.height + 'px'
                scrollTo(0, 0)
                setTimeout(() => {
                    this.scrollToBottom(this.$refs.contentList);
                })
            } else {
                this.height = '100%'
            }
        }

        this.init();

        this.$bus.$on('firework', (data) => {
            this.text = data.text ?? ''
            this.isFirework = true

            setTimeout(() => {
                this.isFirework = false
            }, 3000)
        })

        this.server.on(WebSocketType.GroupChat, (item) => {
            this.recieveMessage(item)
        });

        this.server.on(WebSocketType.PrivateChat, (item) => {
            this.recieveMessage(item)
        });

        this.server.on(WebSocketType.System, (data) => {
            data.delta = this.msgList[this.msgList.length - 1] ? new Date(this.msgList[this.msgList.length - 1].create_time) - data.time : Infinity;
            this.msgList.push(data)
            this.scrollToBottom(this.$refs.contentList);
        });

        this.server.on(WebSocketType.Error, () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("avatar");
            localStorage.removeItem("user");
            this.$router.push('/login')
        });

    },
    async beforeDestroy() {
        this.monitorKeyboard.onEnd();
        await this.saveInfo(this.to)
    },
    computed: {
        to() {
            return this.$route.params.id
        },
        token() {
            return localStorage.getItem("token")
        },
        url() {
            return URL.createObjectURL(this.file)
        },
        userId() {
            return localStorage.getItem("user");
        },
    },
    watch: {
        async to(newVal, oldVal) {
            localStorage.setItem("to", this.to);
            this.avatar = this.friendList.find(user => user.id == this.to)?.avatar
            this.username = this.friendList.find(user => user.id == this.to)?.username
            if (oldVal == this.WorldID) {
                this.isRequestData = false
                this.messageEnd = false
            }
            await this.saveInfo(oldVal);
            await this.init();
        },
        onlineList() {
            this.avatar = this.friendList.find(user => user.id == this.to)?.avatar ?? this.avatar
            this.username = this.friendList.find(user => user.id == this.to)?.username ?? this.username
        }
    }
}
</script>

<style lang="less" scoped>
.home-content {
    position: relative;
    padding: 0;
    margin: 0;
    list-style: none;
    width: 70%;
    height: 100%;
    border-radius: 10px;
    background: #fffa;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    perspective: 0;
    scroll-behavior: smooth;
    transition: none;
    overflow: hidden;
    perspective: 500px;
    z-index: 999;
}

.home-content .home-content-title {
    height: 60px;
    width: calc(100% - 20px);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #fcfcfc;
    background-color: transparent;
    display: flex;
    top: 0;
    align-items: center;
    justify-content: space-between;
    padding: constant(safe-area-inset-top) 10px 0;
    padding: env(safe-area-inset-top) 10px 0;
    box-sizing: content-box;
    font-size: 20px;
    font-weight: bold;
    position: fixed;
    text-align: left;
    z-index: 999;
    overflow: hidden;
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &-box {
        display: flex;
        align-items: center;
    }

    &-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
    }

    &-name {
        font-size: 1.2rem;
    }
}

.home-content .home-content-content {
    flex: 1;
    width: 100%;
    overflow: auto;
    padding: 70px 10px 10px;
    box-sizing: border-box;
    list-style: none;
    position: relative;
    margin: 0;
    transition: none;
}

.home-content .home-content-content .home-content-content-item__end {
    text-align: center;
    padding: 10px;
    font-size: 10px;
    font-weight: bold;
    color: #ccc;
}

.home-content .home-content-content .bubble {
    position: fixed;
    height: var(--BoarderTop);
    width: var(--BoarderTop);
    line-height: var(--BoarderTop);
    bottom: calc(var(--BoarderTop) * 3.5);
    right: var(--BoarderTop);
    background: linear-gradient(to right, #5ea4ff, #915eff);
    border-radius: 50%;
    color: white;
}



.home-content .home-content-input {
    height: 48px;
    border-top: 1px solid #fcfcfc;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 400px;
    transition: none;
    padding: 0 10px;
    box-sizing: content-box;
    gap: 10px;
    width: calc(100% - 20px);
}

.home-content .home-content-input .home-content-input-btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;

    button,
    a {
        border-radius: 10px;
        border: none;
        box-sizing: border-box;
        line-height: 1rem;
        padding: .5rem 1rem;
        user-select: none;
        background-color: #eee;
    }

    &__more {
        height: 2rem !important;
        width: 2rem !important;
        border-radius: 50% !important;
        font-size: 1.5rem;
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;

        #image-send {
            font-size: 1.5rem;
        }
    }

    &__voice {
        height: 2rem !important;
        width: 2rem !important;
        border-radius: 50% !important;
        padding: 0 !important;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}


.home-content .home-content-input .home-content-input-btns button:nth-child(n + 2) {
    margin-top: 5px;
}

.home-content .home-content-input .home-content-input-btns button label {
    height: 100%;
    width: 100%;
    display: block;
    line-height: 30px;
}

#chat-input {
    flex: 1;
    outline: none;
    border: none;
    padding: .75rem 0.5rem;
    user-select: all;
    -webkit-user-select: all;
    -moz-user-select: all;
    -ms-user-select: all;
    resize: none;
    background-color: inherit;
    height: 100%;
    font-size: 1rem;
    line-height: 1.5rem;
    overflow: overlay;
}

.home-content .home-content-image {
    width: 100%;
    height: calc(100% - var(--BoarderTop) * 2);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.home-content .home-content-image.active {
    z-index: 999;
    border: 3px dashed #5ea4ff;
    margin: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px - var(--BoarderTop) * 2);
    border-radius: 10px;
    overflow: hidden;
}

.home-content .home-content-image.active::before {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fffd;
}

.home-content .home-content-image.active::after {
    content: "+";
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 100px;
    transform: translate(-50%, -50%);
    color: #5ea4ff;
    font-weight: 100;
}

.home-content .home-content-image input {
    opacity: 0;
    height: 100%;
    width: 100%;
}


#logout {
    text-decoration: none;
    font-size: 14px;
    background-color: rgba(255, 0, 0, 0.5);
    padding: 8px 10px;
    color: white;
    border-radius: 10px;
    font-weight: 400;
}

.upload-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 600px) {
    .home-content {
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        list-style: none;
        height: 100%;
        width: 100vw;
        position: fixed;
        z-index: 999;
        background-color: white;
        flex-direction: column;
        border-left: 1px solid #fcfcfc;
        text-align: center;
        word-break: break-word;
        top: 0;
        left: 100%;
        border: none;
        border-radius: 0;
    }

    .home-content__show {
        left: 0;
    }

    .home-content .home-content-title .home-content-title-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .home-content .home-content-title .home-content-title-back {
        display: block;
        height: 12px;
        width: 12px;
        margin: 0 10px;
        border: 2px solid transparent;
        border-top-color: #aaa;
        border-left-color: #aaa;
        transform: rotate(-45deg);
    }

    .home-content .home-content-input {
        height: 48px;
        background-color: white;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        display: flex;
        align-items: center;
        justify-content: center;

        &:focus-within {
            padding-bottom: 0;
        }
    }

    .home-content .home-content-input .home-content-input-btns {
        flex-direction: row;
    }

    .home-content .home-content-input .home-content-input-btns button {
        margin: 0 0 0 5px !important;
    }
}
</style>