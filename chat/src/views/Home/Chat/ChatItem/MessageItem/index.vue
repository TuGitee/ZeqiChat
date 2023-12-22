<template>
    <div class="chat-item" :class="`chat-item__${userId == msg.id ? 'me' : 'other'}`" @click="timeShow">
        <img :src="`${APP_MEDIA_URL}${msg.avatar}`" alt="404 Not Found..." class="chat-item-avatar"
            @contextmenu.prevent.stop="handleContextMenu" @touchstart.prevent="handleLongPressStart('user')"
            @touchend.prevent="handleLongPressEnd('user')">
        <div class="chat-item-msg">
            <div class="chat-item-msg-username" v-if="isUserName" v-html="filterMessage(formatMessage(msg.username))"></div>
            <div class="chat-item-msg-flex">
                <button class="chat-item-msg-read" v-if="msg.isSending">
                    <i class="el-icon-loading"></i>
                </button>
                <el-dropdown v-else-if="to != msg.id && userId == msg.id && msg.read_list && msg.read_list.length"
                    trigger="hover" @command="command">
                    <button class="el-dropdown-link" @click.stop>
                        <i class="el-icon-view"></i>
                    </button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="read in msg.read_list" :key="read.id" :command="read">
                            <div class="avatar"><img :src="APP_MEDIA_URL + read.avatar" /></div>
                            <div class="username">{{ read.username }}</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <button class="chat-item-msg-read" v-else-if="to != msg.id && userId == msg.id"
                    :class="msg.to_read ? 'check' : 'close'">
                    <i :class="msg.to_read ? 'el-icon-check' : 'el-icon-close'"></i>
                </button>

                <div class="chat-item-msg-content" v-if="msg.recall" @contextmenu.stop.prevent="handleMessageContextMenu">
                    <span class="chat-item-msg-message recall">该消息已被撤回</span>
                </div>
                <div class="chat-item-msg-content" :class="{ file: isFile }"
                    @contextmenu.stop.prevent="handleMessageContextMenu" v-else
                    @touchstart.prevent="handleLongPressStart('msg')" @touchend.prevent="handleLongPressEnd('msg')"
                    ref="box">
                    <a v-if="isFile" :href="url" target="_blank">
                        <FileIcon :type="type"></FileIcon>
                    </a>
                    <Audio v-if="isAudio" :active="active" @click.stop.native="AudioPlay"></Audio>
                    <div class="audio-play-process" :style="{ '--percent': percent + '%' }"></div>
                    <div class="chat-item-msg-message" v-if="isFile">
                        <div class="content">
                            <a :href="url" target="_blanAudioPlayk">{{ filename }}</a>
                        </div>
                        <div class="tips" v-if="isFile">该文件/外链安全性未知，请勿随意点击或下载，谨慎操作！</div>
                    </div>
                    <div class="chat-item-msg-message" v-else>
                        <div class="content" v-html="filterMessage(formatMessage(msg.message))" v-highlight
                            @click.stop="magic" id="message" ref="message">
                        </div>
                    </div>
                </div>
            </div>
            <el-collapse-transition>
                <div class="chat-item-msg-time" v-show="timeFlag">
                    {{ formatTime(msg.create_time) }}
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>

<script>
import {
    filterMessage,
    formatMessage,
} from "@/utils/message.js";

import formatTime from "@/utils/formatTime.js"
import { mapState } from "vuex";

import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";

import MixinURL from '@/mixins/url'

import Audio from "@/Icons/Audio.vue";

export default {
    name: 'ChatItem',
    mixins: [MixinURL],
    data() {
        return {
            timeFlag: false,
            timer: null,
            time: null,
            pressTimer: null,
            active: false,
            percent: 0
        }
    },
    components: {
        [Dropdown.name]: Dropdown,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,
        FileIcon: () => import('@/components/FileIcon'),
        Audio
    },
    props: {
        msg: {
            type: Object,
            default: () => { }
        },
        isUserName: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState({
            username: state => state.user.username,
            userId: state => state.user.userId
        }),
        isAudio() {
            return this.msg.message?.match(/<audio.*?src="(.+?)"/)
        },
        to() {
            return this.$route.params.id
        },
        isFile() {
            return /^\[.*\]\((.*)\)$/.test(this.msg.message.trim())
        },
        type() {
            if (this.msg.suffix) return this.msg.suffix
            return this.msg.message.trim().match(/^\[.*\]\((.*)\)$/) ? this.msg.message.trim().match(/^\[.*\]\((.*)\)$/)[1].split(".").pop() : null
        },
        url() {
            return this.msg.message.trim().match(/^\[.*\]\((.*)\)$/) ? this.msg.message.trim().match(/^\[.*\]\((.*)\)$/)[1] : 'javascript:void(0);'
        },
        filename() {
            return this.msg.message.trim().match(/^\[(.*)\]\(.*\)$/) ? this.msg.message.trim().match(/^\[(.*)\]\(.*\)$/)[1] : null
        },
        audioURL() {
            return this.msg.message.match(/<audio.*?src="(.*?)"/) ? this.APP_MEDIA_URL + this.msg.message.match(/<audio.*?src="(.*?)"/)[1] : null
        }

    },
    methods: {
        formatMessage,
        filterMessage,
        formatTime,
        command(user) {
            this.$bus.$emit('changeUser', user.id)
        },
        timeShow() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
            this.timeFlag = true
            this.timer = setTimeout(() => {
                this.timeFlag = false
                this.timer = null
            }, 2000)
        },
        AudioPlay() {
            this.$bus.$emit('audio', {
                src: this.audioURL,
            })
        },
        magic(e) {
            const type = e.target.dataset.type
            switch (type) {
                case 'firework':
                    this.$bus.$emit('firework', { ...e.target.dataset })
                    break;
                case 'audio':
                    this.$bus.$emit('audio', { ...e.target.dataset })
                    break;
            }
        },
        handleContextMenu(e) {
            const state = {
                x: e.clientX,
                y: e.clientY,
                menuList: [
                    {
                        label: '私聊',
                        command: 'chat',
                        id: this.msg.id,
                        icon: 'el-icon-chat-line-round'
                    },
                    {
                        label: '动态',
                        command: 'blog',
                        id: this.msg.id,
                        icon: 'el-icon-document'
                    }
                ],
                isShow: true
            }
            if (this.userId == this.msg.id) {
                state.menuList.push({
                    label: '更改信息',
                    command: 'changeAvatar',
                    id: this.msg.id,
                    icon: 'el-icon-user'
                })
            }
            this.$store.commit('SET_STATE', state)
        },
        handleMessageContextMenu(e) {
            const menuList = [
                {
                    label: '复制',
                    command: 'copy',
                    id: this.msg.msg_id,
                    content: this.msg.message,
                    icon: 'el-icon-document-copy',
                    disabled: Boolean(this.msg.recall)
                },
                {
                    label: '转发',
                    command: 'forward',
                    id: this.msg.id,
                    icon: 'el-icon-chat-dot-square',
                    disabled: true
                }, {
                    label: '删除',
                    command: 'delete',
                    id: this.msg.msg_id,
                    icon: 'el-icon-delete',

                },
                {
                    label: '撤回',
                    command: 'recall',
                    id: this.msg.msg_id,
                    icon: 'el-icon-refresh-right',
                    disabled: this.msg.id != this.userId || Boolean(this.msg.recall)
                }
            ]
            if (/^<img.*?src="(.*?)".*?>$/.test(this.msg.message.trim())) {
                menuList.push({
                    label: '下载图片',
                    command: 'downloadImg',
                    id: this.msg.msg_id,
                    content: this.msg.message.trim().match(/^<img.*?src="(.*?)".*?>$/)[1],
                    icon: 'el-icon-picture-outline',
                })
            }
            const state = {
                x: e.clientX,
                y: e.clientY,
                menuList,
                isShow: true
            }
            this.$store.commit('SET_STATE', state)
        },
        handleLongPressStart(type = 'user') {
            this.time = Date.now()
            this.pressTimer = setTimeout(() => {
                this.handleLongPressEnd(type)
            }, 500)
        },
        handleLongPressEnd(type = 'user') {
            clearTimeout(this.pressTimer)
            this.pressTimer = null

            const time = Date.now() - this.time
            if (time > 500) {
                const menuList = type === 'user' ? [{
                    label: '私聊',
                    command: 'chat',
                    id: this.msg.id,
                    icon: 'el-icon-chat-line-round'
                },
                {
                    label: '动态',
                    command: 'blog',
                    id: this.msg.id,
                    icon: 'el-icon-document'

                }] : [{
                    label: '复制',
                    command: 'copy',
                    id: this.msg.msg_id,
                    content: this.msg.message,
                    icon: 'el-icon-document-copy',
                    disabled: Boolean(this.msg.recall)
                },
                {
                    label: '转发',
                    command: 'forward',
                    id: this.msg.id,
                    icon: 'el-icon-chat-dot-square',
                    disabled: true
                }, {
                    label: '删除',
                    command: 'delete',
                    id: this.msg.msg_id,
                    icon: 'el-icon-delete',

                },
                {
                    label: '撤回',
                    command: 'recall',
                    id: this.msg.msg_id,
                    icon: 'el-icon-refresh-right',
                    disabled: this.msg.id != this.userId || Boolean(this.msg.recall)
                }]

                if (type === 'user' && this.userId == this.msg.id) {
                    menuList.push({
                        label: '更改信息',
                        command: 'changeAvatar',
                        id: this.msg.id,
                        icon: 'el-icon-user'

                    })
                }
                this.$store.commit('SET_STATE', {
                    isShow: true,
                    menuList
                })

                const muneDom = document.querySelector('#context-menu')
                muneDom.classList.add('mobile')
                setTimeout(() => {
                    if (muneDom) {
                        const height = muneDom.offsetHeight
                        const width = muneDom.offsetWidth
                        const x = this.userId == this.msg.id ? this.$refs.box.getBoundingClientRect().x + this.$refs.box.getBoundingClientRect().width - width : this.$refs.box.getBoundingClientRect().x
                        const y = this.$refs.box.getBoundingClientRect().y - 5 - height
                        this.$store.commit('SET_STATE', {
                            x,
                            y
                        })
                    }
                })

            }
        },
        percentChange(e) {
            this.percent = (e.target.currentTime / e.target.duration) * 100
        },
    },
    mounted() {
        if (this.isAudio) {
            const audio = document.getElementById('audio')
            this.$bus.$on('audioplay', (src) => {
                if (src === this.audioURL) {
                    this.active = true
                    audio.addEventListener('timeupdate', this.percentChange)

                } else if (this.audioURL) {
                    this.active = false
                    audio.removeEventListener('timeupdate', this.percentChange)

                }
            })
            this.$bus.$on('audiopause', (src) => {
                if (src === this.audioURL) {
                    this.active = false
                    audio.removeEventListener('timeupdate', this.percentChange)
                }
            })

            this.$bus.$on('audiostop', (src) => {
                if (src === this.audioURL) {
                    this.active = false
                    this.percent = 0
                    audio.removeEventListener('timeupdate', this.percentChange)
                }
            })
        }


    }
}
</script>

<style lang="less" scoped>
.chat-item {
    display: flex;
    padding-bottom: 5px;
    margin-bottom: 5px;
    position: relative;

    &__me {
        flex-direction: row-reverse;

        .chat-item-msg {
            margin-right: 10px;
            text-align: right;
            align-items: flex-end;

            .chat-item-msg-content {
                background: #e8eeff !important;
            }
        }
    }

    &__other .chat-item-msg {
        margin-left: 10px;
        text-align: left;
        align-items: flex-start;

        &-flex {
            flex-direction: row-reverse;
        }
    }

    .chat-item-msg {
        display: flex;
        flex-direction: column;
        max-width: 70% !important;
        flex: 1;

        &-flex {
            display: flex;
            align-items: flex-end;
            gap: 5px;
            user-select: none;

            button {
                height: fit-content;
                box-sizing: content-box;
                white-space: nowrap;
                border: none;
                background-color: #EEEA;
                border-radius: 10px;
                padding: 5px 10px;
                color: #333;
                user-select: none;

                .close {

                    &::after {
                        content: '\2715';
                    }
                }
            }

        }

        &-text {
            background: #EEEA;
            margin-top: 10px;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.5;
            text-align: left;
        }

        .chat-item-msg-username {
            font-weight: 700;
            font-size: 12px;
            color: #999;
            line-height: 2;
            user-select: none;

            /deep/ p {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
        }

        .chat-item-msg-content {
            background: #f7f7f7;
            border-radius: 10px;
            padding: 10px;
            height: 100%;
            font-size: 14px;
            color: #333;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: text;
            position: relative;
            overflow: hidden;

            .audio-play-process {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                transform-origin: left center;
                pointer-events: none;
                transform: scaleX(var(--percent));
                transition: none !important;
                background-color: #3331;
            }

            &.file {
                padding: 15px 10px;

                .chat-item-msg-message {
                    max-width: 200px;

                    .tips {
                        font-size: 12px;
                        color: #999;
                        margin-top: 10px;
                    }
                }
            }

            .chat-item-msg-message {
                .content {
                    @import url('~@/less/md.less');
                }

                &.recall {
                    color: #aaa;
                    user-select: none;
                }
            }
        }

        .chat-item-msg-read {
            font-size: 12px;
            color: #333;
            padding: 5px;
            line-height: 1;
            border-radius: 7px;
            user-select: none;

            &.check {
                background-color: #5ea4ff;
                color: white;
            }

            &.close {
                background-color: #ccc6;
            }
        }
    }

    .chat-item-msg-time {
        font-size: 12px;
        color: #999;
        line-height: 2;
        user-select: none;
    }

    .chat-item-avatar {
        height: 40px;
        width: 40px;
        border-radius: 10px;
        overflow: hidden;
        object-fit: cover;
        box-shadow: 1px 1px 10px -5px #ddd;
        user-select: none;
    }
}
</style>
