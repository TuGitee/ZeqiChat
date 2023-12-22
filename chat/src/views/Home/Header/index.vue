<template>
    <header class="header" v-if="!isMobile || !$route.name.includes('chat')">
        <div class="info">
            <router-link :to="{
                name: 'blog',
                params: {
                    id: userId
                }
            }" replace>
                <img :src="APP_MEDIA_URL + avatar" class="avatar" />
                <p class="username">你好，<span v-text="filterMessage(username)"></span></p>
            </router-link>
        </div>
        <Net class="net"></Net>
    </header>
</template>

<script>
import { filterMessage, formatMessage } from "@/utils/message.js";
import { mapState } from "vuex";
import MixinURL from '@/mixins/url'
export default {
    name: 'Header',
    mixins: [MixinURL],
    computed: {
        ...mapState({
            username: state => state.user.username,
            avatar: state => state.user.avatar,
            isMobile: state => state.mobile.isMobile,
            userId: state => state.user.userId
        })
    },
    methods: {
        filterMessage,
        formatMessage
    },
    components: {
        Net: () => import('./Net')
    }
}
</script>

<style lang="less" scoped>
.header {
    @height: calc(50px + constant(safe-area-inset-top));
    @height: calc(50px + env(safe-area-inset-top));
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: @height;
    line-height: @height;
    padding: 0 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    user-select: none;

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #333;
    }

    .info {
        padding-left: 100px;

        .avatar {
            height: 30px;
            width: 30px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 10px;
        }

        .username {
            white-space: nowrap;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 180px;
        }
    }


    .net {
        position: absolute;
        right: 10px;
    }

    @media screen and (max-width: 600px) {
        position: fixed;
        width: calc(100% - 20px);
        box-sizing: content-box;
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        height: 50px;
        left: auto;
        transform: none;
        line-height: 50px;
        z-index: 999;
        justify-content: space-between;
        gap: 20px;

        .info {
            padding-left: 0;

            .username {
                padding-right: 40px;
            }
        }


        .net {
            width: fit-content;

            /deep/ .net-type,
            /deep/ .net-rtt {
                display: none;

            }
        }
    }
}
</style>