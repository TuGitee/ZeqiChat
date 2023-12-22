<template>
    <div class="blog">
        <div class="blog-item" ref="blogItem">
            <div class="blog-item-header">
                <div class="blog-item-header-content">
                    <div class="blog-item-header-avatar" @contextmenu.prevent.stop="handleContextMenu">
                        <router-link :to="{
                            name: 'blog',
                            params: {
                                id: blog.id
                            }
                        }" replace>
                            <img :src="`${APP_MEDIA_URL}${blog.avatar}`" alt="">
                        </router-link>
                    </div>
                    <div class="blog-item-header-info">
                        <router-link :to="{
                            name: 'blog',
                            params: {
                                id: blog.id
                            }
                        }" replace>
                            <div class="blog-item-header-info-name">
                                {{ blog.username }}
                            </div>
                        </router-link>
                        <div class="blog-item-header-info-time">
                            {{ formatTime(blog.create_time) }}
                        </div>
                    </div>
                </div>
                <div class="blog-item-header-tool">
                    <button class="blog-item-header-tool-delete" v-if="blog.username == username"
                        @click="deleteBlog">删除</button>
                    <button class="blog-item-header-tool-collapse" @click="collapse" v-if="blog.commentList.length">{{
                        isCollapse ? '展开' : '折叠' }}</button>
                </div>
            </div>
            <div class="blog-item-content">
                <div class="blog-item-content-text" v-html="filterMessage(formatMessage(blog.content))">
                </div>
                <ul class="blog-item-content-img" v-if="imageList.length">
                    <li class="blog-item-content-img-item" v-for="(  image, index  ) in   imageList  " :key="index">
                        <img :src="image" :preview="blog.blog_id" />
                    </li>
                </ul>
            </div>
            <div class="blog-item-footer">
                <!-- <div class="blog-item-footer-item">
                    <i :class="'el-icon-star-on active'"></i>
                    <span>{{ 0 }}</span>
                </div>
                <div class="blog-item-footer-item">
                    <i class="el-icon-chat-round"></i>
                    <span>{{ 0 }}</span>
                </div> -->
                <router-link :to="{
                    name: 'blog',
                    params: {
                        id: userId
                    }
                }" replace>
                    <img class="blog-item-footer-avatar" :src="`${APP_MEDIA_URL}${avatar}`" alt=""></router-link>
                <form action="#" class="blog-item-footer-form" @submit.prevent="commentBlog">
                    <input type="text" class="blog-item-footer-form-input" placeholder="说点什么..." v-model="comment"
                        :disabled="isRequest">
                    <button class="blog-item-footer-form-button" :disabled="isRequest"><i class="el-icon-loading"
                            v-if="isRequest"></i>评论</button>
                </form>

            </div>
        </div>
        <DrawerTransition>
            <div class="blog-comment" v-if="blog.commentList.length && !isCollapse">
                <div class="blog-comment-title"><span>评论</span></div>
                <ul class="blog-comment-list" :style="{ maxHeight: height }">
                    <li class="blog-comment-list-item" v-for="  comment   in   blog.commentList.slice(0, last)  "
                        :key="comment.comment_id">
                        <router-link :to="{
                            name: 'blog',
                            params: {
                                id: comment.id
                            }
                        }" replace>
                            <div class="blog-comment-list-item-avatar"
                                @contextmenu.prevent.stop="handleCommentContextMenu($event, comment.id)">
                                <img :src="`${APP_MEDIA_URL}${comment.avatar}`" alt="">
                            </div>
                        </router-link>
                        <div class="blog-comment-list-item-content">
                            <div class="blog-comment-list-item-content-info">
                                <strong>{{ comment.username }}</strong> · {{ formatTime(comment.create_time) }}
                            </div>
                            <div class="blog-comment-list-item-content-text" v-text="filterMessage(comment.msg)">
                            </div>
                        </div>
                    </li>

                    <li class="blog-comment-list-item" v-if="blog.commentList.length > last">
                        <div class="blog-comment-list-item-more" @click="last += 5">
                            <span>查看更多</span>
                            <i class="el-icon-arrow-down"></i>
                        </div>
                    </li>

                    <li class="blog-comment-list-item"
                        v-if="last >= blog.commentList.length && blog.commentList.length > 1">
                        <div class="blog-comment-list-item-more" @click="last = 1">
                            <span>收起评论</span>
                            <i class="el-icon-arrow-up"></i>
                        </div>
                    </li>

                </ul>
            </div>
        </DrawerTransition>
    </div>
</template>

<script>
import formatTime from "@/utils/formatTime.js"
import { filterMessage, formatMessage } from "@/utils/message";
import DrawerTransition from '@/components/DrawerTransition'
import { mapState } from "vuex";
import MixinURL from '@/mixins/url'

export default {
    name: 'BlogItem',
    mixins: [MixinURL],
    data() {
        return {
            comment: '',
            isRequest: false,
            height: '0px',
            last: 3,
            isCollapse: false
        }
    },
    components: {
        DrawerTransition
    },
    props: {
        blog: {
            type: Object,
            required: true
        }
    },
    computed: {
        imageList() {
            return JSON.parse(this.blog.images).map(item => `${this.APP_MEDIA_URL}${item}`)
        },
        ...mapState({
            token: state => state.user.token,
            avatar: state => state.user.avatar,
            username: state => state.user.username,
            userId: state => state.user.userId
        })
    },
    methods: {
        formatTime,
        formatMessage,
        filterMessage,
        commentBlog() {
            if (!this.comment.trim()) return
            if (this.isRequest) return
            this.isRequest = true
            this.$axios.post(`/api/blog/comment`, {
                blog_id: this.blog.blog_id,
                user: this.token,
                msg: this.comment
            }).then(res => {
                if (res.data.ok) {
                    this.$emit('commentBlog', this.blog.blog_id, this.comment)
                    this.comment = ''
                }
            }).finally(() => {
                this.isRequest = false
            })
        },
        deleteBlog() {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$emit('deleteBlog', this.blog.blog_id)
                this.$axios.delete(`/api/blog?id=${this.blog.blog_id}&user=${this.token}`).then(res => {
                    if (!res.data.ok) {
                        this.$notify.error({
                            title: '出错',
                            message: res.data.msg,
                            offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                        })
                    }
                })
            }).catch(() => {
            })

        },
        adjustHeight() {
            this.height = this.$refs.blogItem?.clientHeight - 32 + 'px'
        },
        collapse() {
            this.isCollapse = !this.isCollapse
        },
        handleContextMenu(e) {
            this.$store.commit('SET_STATE', {
                x: e.clientX,
                y: e.clientY,
                menuList: [
                    {
                        label: '私聊',
                        command: 'chat',
                        id: this.blog.id,
                        icon: 'el-icon-chat-line-round'
                    },
                    {
                        label: '动态',
                        command: 'blog',
                        id: this.blog.id,
                        icon: 'el-icon-document'
                    },
                ],
                isShow: true
            })
        },
        handleCommentContextMenu(e, id) {
            this.$store.commit('SET_STATE', {
                x: e.clientX,
                y: e.clientY,
                menuList: [
                    {
                        label: '私聊',
                        command: 'chat',
                        id,
                        icon: 'el-icon-chat-line-round'
                    },
                    {
                        label: '动态',
                        command: 'blog',
                        id,
                        icon: 'el-icon-document'
                    },
                ],
                isShow: true
            })
        }
    },
    mounted() {
        if (window.innerWidth > 600) {
            this.adjustHeight()
            const resizeObserver = new ResizeObserver(entries => {
                this.adjustHeight()
            })
            resizeObserver.observe(this.$refs.blogItem)
        } else {
            this.height = 'unset'
        }
    }
}
</script>

<style lang="less" scoped>
.blog {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;

    .blog-item {
        transition: all 0.5s;
        width: 100%;
        background-color: #fffd;
        border-radius: 10px;
        margin-bottom: 10px;
        box-shadow: 0px 5px 7px -5px black;
        padding: 10px;
        height: fit-content;

        .blog-item-header {
            display: flex;
            padding: 10px;
            justify-content: space-between;
            user-select: none;

            .blog-item-header-content {
                display: flex;

                .blog-item-header-avatar {
                    width: 40px;
                    height: 40px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 10px;
                    }
                }

                .blog-item-header-info {
                    margin-left: 10px;
                    text-align: left;
                    flex: 1;

                    a {
                        text-decoration: none;
                        color: #333;
                    }

                    .blog-item-header-info-name {
                        font-size: 1.2rem;
                        line-height: 1.2rem;
                        height: 1.2rem;
                        margin-bottom: .3rem;
                        font-weight: bold;
                        max-width: 12rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        text-align: left;
                        white-space: nowrap;
                    }

                    .blog-item-header-info-time {
                        font-size: 0.8rem;
                        color: #999;
                    }
                }
            }

            .blog-item-header-tool {
                display: flex;
                align-items: flex-start;
                white-space: nowrap;
                gap: 5px;

                .blog-item-header-tool-delete {
                    border: none;
                    background-color: #e73419;
                    color: #fff;
                    border-radius: 10px;
                    padding: 5px 10px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                        background-color: #ff0000;
                    }
                }

                .blog-item-header-tool-collapse {
                    border: none;
                    background-color: #73a0ff;
                    color: #fff;
                    border-radius: 10px;
                    padding: 5px 10px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                        background-color: #007aff;
                    }
                }
            }
        }

        .blog-item-content {
            padding: 0 10px 10px;
            max-height: 500px;
            overflow: auto;
            user-select: text;

            .blog-item-content-text {
                font-size: 1rem;
                color: #333;
                text-align: left;
                user-select: text;

                @import url('~@/less/md.less');
            }

            .blog-item-content-img {
                width: 100%;
                height: fit-content;
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                padding: 0;

                .blog-item-content-img-item {
                    width: 32%;
                    height: unset;
                    aspect-ratio: 1 / 1;
                    margin-top: 5px;
                    list-style: none;

                    &:not(:nth-child(3n)) {
                        margin-right: 2%;
                    }

                    &:nth-last-child(1):first-child img {
                        width: 100%;
                        height: 100%;
                        aspect-ratio: auto / 1;
                    }

                    &:nth-last-child(4):first-child~&:nth-child(even) {
                        margin-right: 32%;
                    }

                    &:nth-last-child(4):first-child~&:nth-child(odd) {
                        margin-right: 2%;
                    }


                    img {
                        border-radius: 10px;
                        object-fit: cover;
                        width: 100%;
                        height: 100%;
                        cursor: zoom-in;
                    }
                }

                .blog-item-content-img-item:nth-last-child(1):first-child {
                    width: 12rem;
                    height: 12rem;
                }
            }

            .blog-item-content-share {
                padding: 10px;
                background-color: #f8f8f8;
                border-radius: 10px;

                &-title {
                    font-size: 0.95rem;
                    color: #999;
                    white-space: pre-wrap;
                    word-break: break-all;


                    &-name {
                        font-weight: bold;
                    }
                }

                &-img {
                    width: 100%;
                    height: fit-content;
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;

                    &-item {
                        width: 32%;
                        height: 100px;
                        margin-top: 5px;
                    }
                }
            }
        }

        .blog-item-footer {
            display: flex;
            padding: 10px;
            align-items: center;
            gap: 10px;

            .active {
                color: red;
            }

            &-item {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    font-size: 1.2rem;
                    color: #999;
                }

                span {
                    margin-left: 5px;
                    font-size: 0.8rem;
                    color: #999;
                }
            }

            &-avatar {
                width: 2.5rem;
                height: 2.5rem;
                object-fit: cover;
                border-radius: 50%;
            }

            &-form {
                display: flex;
                flex: 1;
                gap: 10px;

                &-input {
                    width: 100%;
                    border: none;
                    height: 2rem;
                    outline: none;
                    border-radius: 5px;
                    background-color: #fff;
                    flex: 1;
                    padding: 5px 10px;
                }

                &-button {
                    border: none;
                    outline: none;
                    color: #333;
                    background-color: #fff;
                    border-radius: 5px;
                    padding: 5px 10px;
                    font-size: 0.8rem;
                    line-height: 0.8rem;
                }
            }
        }
    }

    .blog-comment {
        width: 50%;
        height: fit-content;
        background-color: #fffe;
        border-radius: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        user-select: none;

        .blog-comment-title {
            height: 32px;
            font-size: 0.8rem;
            color: #999;
            line-height: 32px;
            text-align: center;
            position: sticky;
            top: 0;
        }

        .blog-comment-list {
            overflow-y: scroll;
            height: fit-content;

            .blog-comment-list-item {
                padding: 10px;
                list-style: none;
                display: flex;
                gap: 10px;
                justify-content: center;

                &:not(:last-child) {
                    border-bottom: 0.1px solid #fff;
                }

                .blog-comment-list-item-avatar {
                    width: 40px;
                    height: 40px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                }

                .blog-comment-list-item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    text-align: left;

                    .blog-comment-list-item-content-info {
                        font-size: 0.8rem;
                        color: #777;
                    }

                    .blog-comment-list-item-content-text {
                        font-size: 0.9rem;
                        color: #333;
                    }

                }

                .blog-comment-list-item-more {
                    font-size: 0.8rem;
                    color: #999;
                    cursor: pointer;
                    text-align: center;
                }
            }
        }
    }

    @media screen and (max-width: 600px) {
        flex-direction: column;

        &::after {
            content: "";
            height: 5px;
            width: 100vw;
            display: block;
            background-color: #eee;
        }

        .blog-item {
            box-shadow: none;
            margin-bottom: 0;

            .blog-item-footer-form-input {
                background-color: #eee;
            }

            .blog-item-footer-form-button {
                background-color: #eee;
                user-select: none;
            }

            .blog-item-header-tool-collapse {
                display: none;
            }

            .blog-item-content {
                max-height: unset;
            }

        }

        .blog-comment {
            width: 100%;
            padding: 0 10px;
        }

    }
}
</style>
