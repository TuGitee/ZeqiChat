<template>
    <div class="chat-item" :class="`chat-item__${username === msg.username ? 'me' : 'other'}`" @click="timeShow">
        <img :src="`http://47.120.2.219:3000${msg.avatar}`" alt="404 Not Found..." class="chat-item-avatar">
        <div class="chat-item-msg">
            <div class="chat-item-msg-username" v-html="formatMessage(removeSlash(msg.username))"></div>
            <div class="chat-item-msg-content">
                <div class="chat-item-msg-message" v-html="formatMessage(removeSlash(msg.message))" v-highlight
                    @click.stop="magic"></div>
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
    removeSlash,
    formatMessage,
} from "@/utils/message.js";

import formatTime from "@/utils/formatTime.js"

export default {
    name: 'ChatItem',
    data() {
        return {
            timeFlag: false,
            timer: null
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
        }
    },
    methods: {
        formatMessage,
        removeSlash,
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
        }
    }

    &__other .chat-item-msg {
        margin-left: 10px;
        text-align: left;
        align-items: flex-start;
    }

    .chat-item-msg {
        display: flex;
        flex-direction: column;
        max-width: 70% !important;
        flex: 1;

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

<style scoped lang="less">
.chat-item-msg-message {

    /deep/ h1 {
        font-size: 3em;
    }

    /deep/ h2 {
        font-size: 2.5em;
    }

    /deep/ h3 {
        font-size: 2em;
    }

    /deep/ h4 {
        font-size: 1.7em;
    }

    /deep/ h5 {
        font-size: 1.3em;
    }

    /deep/ h6 {
        font-size: 1em;
    }

    /deep/ h1,
    /deep/ h2,
    /deep/ h3,
    /deep/ h4,
    /deep/ h5,
    /deep/ h6 {
        position: relative;
        padding-left: 20px;
        line-height: 1;
        margin: 15px 10px 20px;
    }

    /deep/ h1::before,
    /deep/ h2::before,
    /deep/ h3::before,
    /deep/ h4::before,
    /deep/ h5::before,
    /deep/ h6::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 5px;
        border-radius: 10px;
        background-color: #3876b5;
    }

    /deep/ p {
        margin: 5px 0;
        padding-left: 10px;
        line-height: 1.3;
    }

    /deep/ hr {
        padding: 0 10px;
        color: #ff5e5e;
        margin: 10px 0;
    }

    /deep/ codeword {
        background-color: #ddd;
        font-family: "Courier New", Courier, monospace !important;
        display: inline-block;
        padding: 4px 5px 1px;
        margin: 0 0.5em;
        border-radius: 3px;
        line-height: 1;
    }

    /deep/ li {
        list-style: none;
        position: relative;
    }

    /deep/ ul li {
        padding-left: 16px;
    }

    /deep/ ul li::before {
        position: absolute;
        content: "•";
        color: #3876b5;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }

    /deep/ a {
        color: #3876b5;
        text-decoration: none;
    }

    /deep/ a:hover {
        text-decoration: underline;
    }

    /deep/ img,
    /deep/ video {
        max-width: 100%;
        max-height: 200px;
    }

    /deep/ blockquote {
        margin: 0.2em 0;
        padding: 0.5em 1em;
        color: #777;
        line-height: 1.5;
        border-left: 0.25em solid #ccc;
        background-color: #efefef;
    }

    /deep/ code {
        padding: 1em;
        margin: 0 0.2em;
        white-space: break-spaces;
        display: block;
        color: white;
        background-color: #333;
        border-radius: 5px;
    }

    /deep/ code,
    /deep/ code * {
        font-family: "Fira Mono", "DejaVu Sans Mono", Menlo, Consolas,
            "Liberation Mono", Monaco, "Lucida Console", monospace !important;
    }

    /deep/ .hljs {
        color: #c9d1d9;
        background: #0d1117;
    }

    /deep/ .hljs-doctag,
    /deep/ .hljs-keyword,
    /deep/ .hljs-meta .hljs-keyword,
    /deep/ .hljs-template-tag,
    /deep/ .hljs-template-variable,
    /deep/ .hljs-type,
    /deep/ .hljs-variable.language_ {
        /* prettylights-syntax-keyword */
        color: #ff7b72;
    }

    /deep/ .hljs-title,
    /deep/ .hljs-title.class_,
    /deep/ .hljs-title.class_.inherited__,
    /deep/ .hljs-title.function_ {
        /* prettylights-syntax-entity */
        color: #d2a8ff;
    }

    /deep/ .hljs-attr,
    /deep/ .hljs-attribute,
    /deep/ .hljs-literal,
    /deep/ .hljs-meta,
    /deep/ .hljs-number,
    /deep/ .hljs-operator,
    /deep/ .hljs-variable,
    /deep/ .hljs-selector-attr,
    /deep/ .hljs-selector-class,
    /deep/ .hljs-selector-id {
        /* prettylights-syntax-constant */
        color: #79c0ff;
    }

    /deep/ .hljs-regexp,
    /deep/ .hljs-string,
    /deep/ .hljs-meta .hljs-string {
        /* prettylights-syntax-string */
        color: #a5d6ff;
    }

    /deep/ .hljs-built_in,
    /deep/ .hljs-symbol {
        /* prettylights-syntax-variable */
        color: #ffa657;
    }

    /deep/ .hljs-comment,
    /deep/ .hljs-code,
    /deep/ .hljs-formula {
        /* prettylights-syntax-comment */
        color: #8b949e;
    }

    /deep/ .hljs-name,
    /deep/ .hljs-quote,
    /deep/ .hljs-selector-tag,
    /deep/ .hljs-selector-pseudo {
        /* prettylights-syntax-entity-tag */
        color: #7ee787;
    }

    /deep/ .hljs-subst {
        /* prettylights-syntax-storage-modifier-import */
        color: #c9d1d9;
    }

    /deep/ .hljs-section {
        /* prettylights-syntax-markup-heading */
        color: #1f6feb;
        font-weight: bold;
    }

    /deep/ .hljs-bullet {
        /* prettylights-syntax-markup-list */
        color: #f2cc60;
    }

    /deep/ .hljs-emphasis {
        /* prettylights-syntax-markup-italic */
        color: #c9d1d9;
        font-style: italic;
    }

    /deep/ .hljs-strong {
        /* prettylights-syntax-markup-bold */
        color: #c9d1d9;
        font-weight: bold;
    }

    /deep/ .hljs-addition {
        /* prettylights-syntax-markup-inserted */
        color: #aff5b4;
        background-color: #033a16;
    }

    /deep/ .hljs-deletion {
        /* prettylights-syntax-markup-deleted */
        color: #ffdcd7;
        background-color: #67060c;
    }

    /* for block of numbers */
    /deep/ .hljs-ln-numbers {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        text-align: center;
        color: #ccc;
        vertical-align: top;
        padding-right: 10px;

        /* your custom style here */
    }

    /deep/ .hljs-ln-n:before {
        margin-right: 10px;
        white-space: nowrap;
    }

    /* for block of code */
    /deep/ .hljs-ln-code {
        padding-left: 10px;
    }
}
</style>