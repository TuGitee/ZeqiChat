<template>
    <li class="user">
        <div class="user-title">
            <div class="user-title-avatar">
                <img :src="`http://47.120.2.219:3000${user.avatar}`" alt="404 Not Found..." class="user-title-avatar-img">
            </div>

            <div class="user-title-content">
                <p class="user-title-content-header">
                    <span class="user-title-username" v-html="formatMessage(removeSlash(user.username))"></span>
                    <span class="user-title-btns">
                        <button v-if="user.accept === 0 && user.from_id == userId"
                            class="user-title-content-btn pending">等待同意...</button>
                        <button v-if="user.accept === 0 && user.from_id != userId" class="user-title-content-btn resolve"
                            @click="resolveUser">同意</button>
                        <button v-if="user.accept === 0 && user.from_id != userId" class="user-title-content-btn reject"
                            @click="rejectUser">拒绝</button>
                        <button v-if="user.accept === 1" class="user-title-content-btn resolved"><i
                                class="el-icon-check"></i> 已同意</button>
                        <button v-if="user.accept === -1" class="user-title-content-btn rejected"><i
                                class="el-icon-close"></i> 已拒绝</button>
                    </span>

                </p>
            </div>
        </div>
    </li>
</template>

<script>
import { removeSlash, formatMessage } from "@/utils/message";
import formatTime from '@/utils/formatTime.js'
export default {
    name: 'UserItem',
    props: {
        user: {
            type: Object,
        },
    },
    computed: {
        userId() {
            return localStorage.getItem("user");
        },
        token() {
            return localStorage.getItem("token");
        }
    },
    methods: {
        removeSlash,
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
    mounted() {
        console.log(this.user);
    }
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

                        &.resolve {
                            color: #333;
                        }

                        &.reject {
                            background-color: #d61414;
                            color: white;
                        }

                        &.resolved {
                            background: #fff0;
                            color: #33ae64;
                            cursor: default;
                        }

                        &.rejected {
                            background: #fff0;
                            color: #d61414;
                            cursor: default;
                        }
                    }
                }

                .user-title-content-btn {
                    padding: 5px 10px;
                    border-radius: 5px;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 700;
                    white-space: nowrap;

                    &.resolve {
                        color: #333;
                    }

                    &.reject {
                        background-color: #d61414;
                        color: white;
                    }

                    &.resolved {
                        background: #fff0;
                        color: #33ae64;
                        cursor: default;
                    }

                    &.rejected {
                        background: #fff0;
                        color: #d61414;
                        cursor: default;
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

        .user-title-username {
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

}
</style>