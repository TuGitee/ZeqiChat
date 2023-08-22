<template>
    <li class="user" @click="changeUser" :class="{ active: user.id == to }">
        <div class="user-title">
            <div class="user-title-avatar">
                <i class="user-title-avatar-online" :style="{ backgroundColor: user.online ? '#43da83' : '#ff5e5e' }"></i>
                <img :src="`https://zeqichat.xyz${user.avatar}`" alt="404 Not Found..." class="user-title-avatar-img"
                    :style="{ filter: user.online ? 'grayscale(0)' : 'grayscale(1)' }">
                <i class="user-title-avatar-count" v-if="user.id == userId || user.unread">{{ user.id == userId ? "me" :
                    user.unread
                }}</i>
            </div>

            <div class="user-title-content">
                <p class="user-title-content-header">
                    <span class="user-title-username" v-html="filterMessage(formatMessage(user.username))"></span>
                    <span class="user-title-time">{{ formatTime(user.last.create_time).slice(0, -3) }}</span>
                </p>
                <p class="user-title-message">
                    <span class="user-title-name" v-if="user.last.username"
                        v-html="filterMessage(formatMessage(user.last.username))"></span>
                    <span v-text="filterMessage(user.last.message)" class="user-title-msg"></span>
                </p>
            </div>
        </div>
    </li>
</template>

<script>
import { filterMessage, formatMessage } from "@/utils/message";
import formatTime from '@/utils/formatTime.js'
export default {
    name: 'UserItem',
    props: {
        user: {
            type: Object,
        },
        to: {
            type: String | Number,
        }
    },
    computed: {
        userId() {
            return localStorage.getItem("user");
        }
    },
    methods: {
        filterMessage,
        formatMessage,
        formatTime,
        changeUser() {
            this.$emit('changeUser', this.user.id, this.user.username, this.user.avatar)
        }
    }
}
</script>

<style lang="less" scoped>
.active {
    background-color: #f6f6f688;
    box-shadow: 0 0 10px #f6f6f688;
}

.user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    width: 100%;
    padding: 10px;
    cursor: pointer;
    list-style: none;
    margin: 0;
    border-radius: 10px;
    position: relative;

    &:not(:last-child) {
        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 1px;
            background: linear-gradient(to right, #fff0, white, #fff0);
        }
    }

    .user-title {
        display: flex;
        align-items: center;
        height: 100%;
        flex: 1;

        .user-title-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1.5;

            p {
                padding-left: 10px;
            }

            .user-title-content-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .user-title-time {
                    color: grey;
                    font-size: 14px;
                    white-space: nowrap;
                }
            }
        }

        .user-title-message {
            color: #444;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            .user-title-name {
                font-weight: bold;

                &::after {
                    content: "·";
                    margin: 0 5px;
                }
            }
        }

        .user-title-avatar {
            height: 50px;
            width: 50px;
            display: block;
            filter: drop-shadow(1px 1px 10px -5px #ddd);
            position: relative;

            .user-title-avatar-online {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
                transform: translate(33%, -33%);
                width: 10px;
                height: 10px;
                border-radius: 10px;
            }

            .user-title-avatar-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
                overflow: hidden;
            }

            .user-title-avatar-count {
                position: absolute;
                right: 0;
                bottom: 0;
                transform: translate(25%, 50%);
                box-sizing: content-box;
                display: inline-block;
                border-radius: 10px;
                background: #ff5e5e;
                padding: 2px 5px;
                color: #fff;
                font-size: 14px;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                width: fit-content;
            }
        }

        .user-title-username {
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

}
</style>