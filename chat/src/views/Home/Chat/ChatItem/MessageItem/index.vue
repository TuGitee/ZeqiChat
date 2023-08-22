<template>
    <div class="chat-item" :class="`chat-item__${username === msg.username ? 'me' : 'other'}`" @click="timeShow">
        <img :src="`https://zeqichat.xyz${msg.avatar}`" alt="404 Not Found..." class="chat-item-avatar"
            @click.stop="changeInfo">
        <div class="chat-item-msg">
            <div class="chat-item-msg-username" v-html="filterMessage(formatMessage(msg.username))"></div>
            <div class="chat-item-msg-flex">
                <button @click.stop="toText" v-if="isAudio">{{ isShow ? '收起' : '转文字' }}</button>
                <div class="chat-item-msg-content">
                    <div class="chat-item-msg-message" v-html="filterMessage(formatMessage(msg.message))" v-highlight
                        @click.stop="magic" id="message"></div>
                </div>
            </div>
            <el-collapse-transition>
                <div class="chat-item-msg-text" v-if="isShow && isAudio"
                    v-html="text ? '<strong>语音识别结果：</strong>' + text : '<strong>未识别到语音信息</strong>'"></div>
            </el-collapse-transition>
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

export default {
    name: 'ChatItem',
    data() {
        return {
            timeFlag: false,
            timer: null,
            text: null,
            isShow: false
        }
    },
    props: {
        msg: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        username() {
            return localStorage.getItem('username')
        },
        isAudio() {
            return this.msg.message.startsWith('<audio')
        }
    },
    methods: {
        formatMessage,
        filterMessage,
        formatTime,
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
        magic(e) {
            const type = e.target.dataset.type
            switch (type) {
                case 'firework':
                    this.$bus.$emit('firework', { ...e.target.dataset })
                    break;
            }
        },
        changeInfo() {
            if (this.username == this.msg.username)
                this.$bus.$emit('changeInfo')
            else {
                this.$router.push({
                    name: 'blog',
                    params: {
                        id: this.msg.id
                    }
                })
            }
        },
        toText() {
            this.isShow = !this.isShow
        }
    },
    mounted() {
        if (this.msg.message.match(/data-value="(.*?)"/))
            this.text = this.msg.message.match(/data-value="(.*?)"/)[1]
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
            align-items: center;
            gap: 5px;

            button {
                height: fit-content;
                box-sizing: content-box;
                white-space: nowrap;
                border: none;
                background-color: #EEEA;
                border-radius: 10px;
                padding: 5px 10px;
                color: #333;
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
        }

        .chat-item-msg-content {
            background: #f7f7f7;
            border-radius: 10px;
            padding: 10px;
            font-size: 14px;
            color: #333;
            text-align: left;

            .chat-item-msg-message {
                @import url('~@/less/md.less');
            }
        }
    }

    .chat-item-msg-time {
        font-size: 12px;
        color: #999;
        line-height: 2;
    }

    .chat-item-avatar {
        height: 50px;
        width: 50px;
        border-radius: 10px;
        overflow: hidden;
        object-fit: cover;
        box-shadow: 1px 1px 10px -5px #ddd;
    }
}
</style>
