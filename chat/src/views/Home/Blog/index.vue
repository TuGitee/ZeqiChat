<template>
    <div class="box" @scroll="scroll">
        <div class="info">
            <div class="info-header">
                <div class="info-header-avatar">
                    <img v-if="userInfo.avatar" :src="`https://zeqichat.xyz${userInfo.avatar}`" alt="">
                    <span>{{ userInfo.username }}</span>
                </div>
                <div class="info-header-info" v-if="id == userId || id == 2023">
                    <router-link to="/home/post">
                        <button class="info-header-info-post">发表动态</button>
                    </router-link>
                </div>
            </div>
        </div>
        <BlogItem v-for="blog in blogs" :blog="blog" :key="blog.blog_id" @deleteBlog="deleteBlog"
            @commentBlog="commentBlog" />

        <div class="loading" v-if="isRequest">
            <i class="el-icon-loading"></i> <span>正在加载中...</span>
        </div>

        <div class="zero" v-if="!blogs.length && blogEnd">
            <el-empty description="暂无动态"></el-empty>
            <br />
            <router-link to="/home/post" v-if="id === userId"><i class="el-icon-thumb"></i>
                <span>快去发表动态吧</span></router-link>
        </div>

        <div class="end" v-if="blogEnd && blogs.length">
            <i class="el-icon-s-promotion"></i> <span>已经到底了...</span>
        </div>
    </div>
</template>

<script>
import { Empty, Dialog } from 'element-ui'
export default {
    name: "Blog",
    components: {
        BlogItem: () => import('./BlogItem'),
        [Empty.name]: Empty,
        [Dialog.name]: Dialog
    },
    data() {
        return {
            blogs: [],
            pageNo: 0,
            pageDelta: 0,
            isRequest: false,
            blogEnd: false,
            pageSize: 2,
            userInfo: {},
            controller: null,
        }
    },
    methods: {
        getRequestBlog() {
            if (this.isRequest) return
            if (this.blogEnd) return
            this.isRequest = true
            this.$axios.get(`/api/blog?pageNo=${this.pageNo}&pageDelta=${this.pageDelta}&pageSize=${this.pageSize}${this.id === 2023 ? '' : `&userId=${this.id}`}`, {
                signal: this.controller.signal
            }).then(res => {
                if (!res.data.ok) {
                    this.isRequest = false
                    this.blogEnd = true
                    return
                }
                this.blogs.push(...res.data.msg.reverse())
                this.pageNo++
                this.isRequest = false
                if (res.data.msg.length < this.pageSize) {
                    this.blogEnd = true
                }
            }).catch(e => { })
        },
        deleteBlog(id) {
            const index = this.blogs.findIndex(blog => blog.blog_id === id)
            this.blogs.splice(index, 1)
        },
        commentBlog(id, comment) {
            this.blogs.find(blog => blog.blog_id === id).commentList.unshift({
                username: this.username,
                avatar: this.avatar,
                msg: comment,
                create_time: new Date()
            })
        },
        scroll(e) {
            if (e.target.scrollTop + e.target.clientHeight + 100 >= e.target.scrollHeight) {
                this.getRequestBlog()
            }
        },
        async init() {
            this.blogs = []
            this.pageNo = 0
            this.pageDelta = 0
            this.isRequest = false
            this.blogEnd = false
            this.getRequestBlog()
            let res = await this.$axios.get(`/api/user/${this.id}`, {
                signal: this.controller.signal
            })
            this.userInfo = res.data.ok ? res.data.data : {
                avatar: "/images/world.jpg",
                username: "推荐"
            }
        }
    },
    computed: {
        avatar() {
            return localStorage.getItem('avatar')
        },
        username() {
            return localStorage.getItem('username')
        },
        id() {
            return this.$route.params.id
        },
        userId() {
            return localStorage.getItem('user')
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(newVal, oldVal) {
                this.controller?.abort()
                this.controller = new AbortController()
                this.init()
            }
        }
    },
    beforeDestroy() {
        this.controller?.abort();
    }
}
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    height: 100%;
    padding-right: 10px;
    overflow-y: auto;
    overflow-x: hidden;

    .info {
        width: 100%;
        padding: 20px 0;

        .info-header {
            width: 100%;
            display: flex;
            position: relative;
            justify-content: space-between;

            .info-header-avatar {
                width: 120px;
                height: 120px;
                transform: translateX(10px);
                display: flex;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 20px;
                    object-fit: cover;
                }

                span {
                    white-space: nowrap;
                    font-size: 96px;
                    max-width: calc(100% - 120px);
                    line-height: 1;
                    color: #333;
                    font-weight: 900;
                    display: inline-block;
                    padding: 0 10px;
                }
            }

            .info-header-info {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                position: absolute;
                bottom: 30%;

                .info-header-info-post {
                    width: fit-content;
                    padding: 10px 20px;
                    background-color: #fffd;
                    border-radius: 10px;
                    border: none;
                }
            }

            &::after {
                content: "";
                display: block;
                position: absolute;
                height: 1px;
                width: 100%;
                bottom: 20%;
                z-index: -1;
                background-color: white;
            }
        }


    }

    .loading {
        text-align: center;
        padding: 10px;
        color: white;
        font-size: 14px;
        font-weight: 400;
    }

    .zero {
        text-align: center;
        padding: 20px;
        color: white;
        font-size: 16px;
        font-weight: 400;
        font-weight: 700;
        line-height: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        a {
            color: white;
            font-size: 16px;
            font-weight: 400;
            text-decoration: none;
            line-height: 2;
            font-weight: 700;

            &:hover {
                text-decoration: underline;
            }
        }

        /deep/ .el-empty {

            &__description {

                p {
                    color: white;
                }
            }
        }
    }

    .end {
        text-align: center;
        padding: 20px;
        color: white;
        font-size: 14px;
        font-weight: 400;

    }

    @media screen and (max-width: 600px) {
        padding-left: 0;
        padding-right: 0 !important;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 55px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 55px);
        overflow-y: overlay;

        &::-webkit-scrollbar {
            width: 0;
        }

        .info-header-info-post {
            background-color: #eee !important;
            margin-right: 10px;
        }


        .loading,
        .zero,
        .info,
        .end {
            color: #ccc;

            /deep/ .el-empty__description {

                p {
                    color: #ccc;
                }
            }
        }
    }
}
</style>