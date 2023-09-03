<template>
    <li class="user">
        <div class="user-title">
            <div class="user-title-avatar">
                <img :src="`https://zeqichat.xyz${user.avatar}`" alt="404 Not Found..." class="user-title-avatar-img">
            </div>

            <div class="user-title-content">
                <p class="user-title-content-header">
                    <span class="user-title-content-name">
                        <span class="user-title-username" v-html="filterMessage(formatMessage(user.username))"></span>
                        <time>{{ formatTime(user.create_time) }}</time>
                    </span>
                    <span class="user-title-btns">
                        <button v-if="user.accept === 0 && user.from_id == userId"
                            class="user-title-content-btn pending">等待同意...</button>
                        <button v-if="user.accept === 0 && user.from_id != userId" class="user-title-content-btn resolve"
                            @click="resolveUser">同意</button>
                        <button v-if="user.accept === 0 && user.from_id != userId" class="user-title-content-btn reject"
                            @click="rejectUser">拒绝</button>
                        <button v-if="user.accept === 1" class="user-title-content-btn resolved"><i
                                class="el-icon-check"></i>
                            已同意</button>
                        <button v-if="user.accept === -1" class="user-title-content-btn rejected"><i
                                class="el-icon-close"></i>
                            已拒绝</button>
                    </span>
                </p>
            </div>
        </div>
    </li>
</template>

<script>
import { filterMessage, formatMessage } from "@/utils/message";
import formatTime from '@/utils/formatTime.js'
import { mapState } from "vuex";
export default {
    name: 'UserItem',
    props: {
        user: {
            type: Object,
        },
    },
    computed: {
        ...mapState({
            userId: state => state.user.userId,
            token: state => state.user.token
        })
    },
    methods: {
        filterMessage,
        formatMessage,
        formatTime,
        resolveUser() {
            this.$axios.put("/api/friend", {
                to: this.token,
                id: this.user.request_id,
            })
            this.$emit('resolveUser', this.user.request_id)
        },
        rejectUser() {
            this.$axios.delete(`/api/friend?to=${this.token}&id=${this.user.request_id}`)
            this.$emit('rejectUser', this.user.request_id)
        }
    },
}
</script>

<style lang="less" scoped>
.user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    width: 100%;
    padding: 10px;
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

                .user-title-content-name {
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;

                    .user-title-username {
                        font-weight: 700;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: left;
                    }

                    time {
                        font-size: 12px;
                        text-align: left;
                        white-space: nowrap;
                        color: #777;
                        display: inline-block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .user-title-btns {
                    display: flex;
                    gap: 5px;

                    .user-title-content-btn {
                        padding: 5px 10px;
                        border-radius: 5px;
                        border: none;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 700;
                        white-space: nowrap;
                        line-height: 1.5;

                        &.pending {
                            color: #333;
                        }

                        &.resolve {
                            color: #333;
                        }

                        &.reject {
                            background-color: #d61414;
                            color: white;
                        }

                        &.resolved {
                            background: #33ae64;
                            color: white;
                            cursor: default;
                        }

                        &.rejected {
                            background: #d61414;
                            color: white;
                            cursor: default;
                        }
                    }
                }

            }
        }

        .user-title-avatar {
            height: 50px;
            width: 50px;
            display: block;
            filter: drop-shadow(1px 1px 10px -5px #ddd);
            position: relative;

            .user-title-avatar-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
                overflow: hidden;
            }
        }

    }

}
</style>