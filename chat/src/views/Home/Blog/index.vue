<template>
    <div class="box" @scroll="scroll">
        <div class="info">
            <div class="info-header"
                :style="{ background: userInfo.background ? `url('https://zeqichat.xyz${userInfo.background}')  no-repeat center/cover` : `url(${require('@/assets/bg.png')}) no-repeat center/cover` }">
                <div class="info-header-avatar">
                    <img v-if="userInfo.avatar" :src="`https://zeqichat.xyz${userInfo.avatar}`" alt=""
                        @contextmenu.prevent.stop="handleContextMenu">
                    <span style="mix-blend-mode: difference; color: white;">{{ userInfo.username }}</span>
                </div>
                <div class="info-header-info" v-if="id == userId || id == WORLD_ID">
                    <router-link to="/home/post">
                        <button class="info-header-info-post"><i class="el-icon-edit"></i>&nbsp;&nbsp;动态</button>
                    </router-link>
                </div>
                <div class="info-header-bg" v-if="id == userId">
                    <button class="info-header-info-bg">
                        <label for="upload">
                            <i class="el-icon-picture"></i>
                        </label>
                    </button>
                    <input type="file" id="upload" style="display: none" accept="image/*" @change="fileChange" />
                </div>
                <div class="info-header-back" v-else>
                    <router-link :to="`/home/blog/${this.userId}`">
                        <button class="info-header-info-back">
                            <i class="el-icon-s-home"></i>个人主页
                        </button>
                    </router-link>
                </div>
                <div class="info-header-world" v-if="id == userId">
                    <button class="info-header-info-world">
                        <router-link :to="`/home/blog/${WORLD_ID}`">
                            <i class="el-icon-s-promotion"></i>
                        </router-link>
                    </button>
                    <input type="file" id="upload" style="display: none" accept="image/*" @change="fileChange" />
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
            <router-link to="/home/post" v-if="id === userId"><i
                    class="el-icon-thumb"></i>&nbsp;<span>快去发表动态吧</span></router-link>
        </div>

        <div class="end" v-if="blogEnd && blogs.length">
            <i class="el-icon-s-promotion"></i> <span>已经到底了...</span>
        </div>
    </div>
</template>

<script>
import { Empty, Dialog } from 'element-ui'
import { mapState } from 'vuex'
import { WORLD_ID } from '@/ws'
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
            file: null,
            WORLD_ID
        }
    },
    methods: {
        getRequestBlog() {
            if (this.isRequest) return
            if (this.blogEnd) return
            this.isRequest = true
            this.$axios.get(`/api/blog?pageNo=${this.pageNo}&pageDelta=${this.pageDelta}&pageSize=${this.pageSize}${this.id == this.WORLD_ID ? '' : `&userId=${this.id}`}`, {
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
        init() {
            this.controller?.abort()
            this.controller = new AbortController()

            this.$axios.get(`/api/user/${this.id}`, {
                signal: this.controller.signal
            }).then(res => {
                this.userInfo = res.data.ok ? res.data.data : {
                    avatar: "/images/world.jpg",
                    username: "推荐",
                    id: this.WORLD_ID
                }
            })

            this.blogs = []
            this.pageNo = 0
            this.pageDelta = 0
            this.isRequest = false
            this.blogEnd = false
            this.getRequestBlog()

            setTimeout(() => {
                this.getRequestBlog()
            }, 500)
        },
        fileChange(e) {
            this.file = e.target.files[0]
            const formData = new FormData()
            formData.append('image', this.file)
            this.$axios.post('/api/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.data.ok) {
                    this.userInfo.background = res.data.image
                    this.$axios.post('/api/user/background', {
                        background: res.data.image,
                        id: this.userId
                    }).then(res => {
                        if (res.data.ok) {
                            this.$notify.success({
                                title: '成功',
                                message: '上传背景成功!',
                                offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                            })
                        } else {
                            this.$notify.error({
                                title: '失败',
                                message: '上传背景失败!',
                                offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                            })
                        }
                    })
                } else {
                    this.$notify.error({
                        title: '失败',
                        message: '上传背景失败!',
                        offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                    })
                }
            })

        },
        handleContextMenu(e) {
            this.$store.commit('SET_STATE', {
                x: e.clientX,
                y: e.clientY,
                menuList: [
                    {
                        label: '私聊',
                        command: 'chat',
                        id: this.userInfo.id,
                        icon: 'el-icon-chat-dot-square'
                    }
                ],
                isShow: true
            })
        },
    },
    computed: {
        ...mapState({
            avatar: state => state.user.avatar,
            username: state => state.user.username,
            userId: state => state.user.userId
        }),
        id() {
            return this.$route.params.id
        },
    },
    beforeDestroy() {
        this.controller?.abort();
    },
    created() {
        this.init()
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
        padding-bottom: 10px;

        .info-header {
            width: 100%;
            height: 240px;
            display: flex;
            border-radius: 10px;
            align-items: flex-end;
            position: relative;
            justify-content: space-between;

            .info-header-avatar {
                display: flex;
                align-items: center;
                margin: 0 0 10px 10px;
                flex: 1;
                overflow: hidden;

                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    object-fit: cover;
                }

                span {
                    white-space: nowrap;
                    font-size: 30px;
                    line-height: 1;
                    display: inline-block;
                    width: fit-content;
                    padding: 0 10px;
                    color: #333;
                    font-weight: 900;
                    user-select: none;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .info-header-info {

                .info-header-info-post {
                    cursor: pointer;
                    width: fit-content;
                    white-space: nowrap;
                    padding: 10px 20px;
                    background-color: #fffd;
                    border-radius: 10px;
                    border: none;
                    margin: 0 15px 15px 0;
                    user-select: none;
                    color: #333;
                }
            }

            .info-header-bg {
                position: absolute;
                top: 15px;
                left: 15px;

                .info-header-info-bg {
                    height: 30px;
                    width: 30px;
                    line-height: 30px;
                    background-color: #333a;
                    border-radius: 10px;
                    border: none;
                    color: white;
                    cursor: pointer;

                    &:hover {
                        background-color: #000a;
                    }

                    label {
                        display: block;
                        height: 100%;
                        width: 100%;
                    }
                }
            }

            .info-header-back {
                position: absolute;
                top: 15px;
                left: 15px;

                .info-header-info-back {
                    height: 20px;
                    line-height: 20px;
                    padding: 5px 10px;
                    box-sizing: content-box;
                    background-color: #333a;
                    border-radius: 10px;
                    border: none;
                    color: white;
                    cursor: pointer;
                    user-select: none;

                    &:hover {
                        background-color: #000a;
                    }

                    i {
                        margin-right: 5px;
                    }

                    a {
                        color: white;
                        text-decoration: none;
                        height: 100%;
                        width: 100%;
                        display: block;
                    }
                }
            }

            .info-header-world {
                position: absolute;
                top: 20px;
                right: 20px;
                height: 1rem;
                width: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;

                .info-header-info-world {
                    line-height: 1;
                    border: none;
                    color: white;
                    cursor: pointer;
                    background-color: transparent;
                    filter: drop-shadow(0 0 10px #000);

                    &:hover {
                        filter: drop-shadow(0 0 10px #000) invert(1);
                    }

                    i {
                        color: white;
                        font-size: 1rem;
                    }

                }
            }
        }


    }

    .loading,
    .zero,
    .end {
        user-select: none;

        color: white;
        text-align: center;
    }

    .loading {
        padding: 10px;
        font-size: 14px;
        font-weight: 400;
    }

    .zero {
        padding: 20px;
        font-size: 16px;
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
        padding: 20px;
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

        .info-header {
            border-radius: 0 0 10px 10px !important;
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