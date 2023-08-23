<template>
    <nav class="bar">
        <ul class="list">
            <router-link :to="{
                name: item.component ? isMobile ? (item.name === 'chat' ? 'home' : item.name) : item.name : '',
                params: {
                    id: isMobile ? 2023 : item.name === 'blog' ? 2023 : to
                },
            }" v-for="item in list" :key="item.name">
                <li class="item"
                    :class="{ active: $route.name === 'home' && item.name === 'chat' ? true : $route.name == item.name, disabled: !item.component }">
                    <p class="icon"><i :class="item.meta.icon"></i></p>
                    <p class="text">{{ item.meta.title }}</p>
                </li>
            </router-link>
        </ul>
        <ul class="tool list">
            <li class="item github">
                <p class="icon"><a href="https://github.com/TuGitee/chatwith" target="_blank"><img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAA1JJREFUWEe1VztrFFEYHd8WvuXefWYX42pgCy0W64ggYmMhpBEFtdDGTrERTNwfIEYNqezFP6CdChYxIJoUQhBEDcRCo24eEDE6nnPzzTo78+1msrseOOzM9zjfnfteLynK5fLmjDEnUtaOpI15mjJmCs/zjnh2NvgYw1hJ6xxFY9IoMArWQD8hGTvKXJFZO0ql0haIVPFlCyHhNVFyq9QS2WRgy5E8FhVsl9RK3Bs5aw8haToq0gVOU1vK6JDx/h/FA0437QmOk9Ltb2F7iN+vEXsSfkfuI/y+CttZQ50TcFbDgWTG2kv09ff3b0ylUhexzD4738rSmwSfg8/ACfAHyLxZ8EqwFFHwtNjDrNJXh0y62GxPp9NHJMShbMw22MqDg4PrxVSH7/vrstnswUKhsFtMDmj4vpguajUMBYxc5w1BZCaTqUhI24BGQdMGR10Auwov6iaDlp5zQR0APXZS0wZrbpjc9qoEsJuQXBSdtoFh2Qu9L1F9krU97t+aE7wuGh0DWhci2itEbc5SHiwxZy6XOyD5HaNYLO7SarA2WzelOBY4qyW/K4Dux2gdcIpDwDXd4EAD3kte1wDd8Wgd1qZjMeYwZk7yugZ+lFJnsVnX+NhArOR2DMyBrdBcitUw5gNb9lJx+Glrz0p+x2ix1MfYgGHNCY53ayJirB8r+mzAcLPDIgi4JhptAzrno7oBWdvr6+vbjpe5qFP4B6xWKpVNopcYPLD4AchfDumFOcfDzQVjvO+HHLdxDJ/BL4/YwPYJHIL9eD6f3+OSFPT29u7E5D0GvRvo9neh/BgRc0/SPC9vTAnGn+L8xkJsHUReBwl1WvtCO44JfLG6qypc6jFmv6StAMZboYAatuI8t2M8NxwkWWtPSUoM+Pqj4dgWHJKUf5BreL3b8TUPaHeXFWuvwnaHN6RWV2wOT5DfghNNNXB09iBgRgKXeZaLKzGQ90vyNc6whoTqyBlzmIGSsIwxf8LZjF64DN4cGBjYIKEqXE68MDlDbQlrDY4/Cr9RRPzV/vch5nc0B5zk1UxCkkHmxBDYsIdzX5cQFYjh3hHEc2VVV8tpCS4XdP1dCNXQK/O8ootLBeJmGQeOdPNS467k0Su3Bg4fem+HvK4Cz/sL2ARSo/g/MBkAAAAASUVORK5CYII="
                            alt=""></a></p>
                <p class="text"><a href="https://github.com/TuGitee/chatwith" target="_blank">GitHub</a></p>
            </li>
            <li class="item" @click="notice">
                <p class="icon"><i :class="`el-icon-message${isMobile ? '' : '-solid'}`"></i></p>
                <p class="text">公告</p>
            </li>
        </ul>
    </nav>
</template>

<script>
import { filterMessage, formatMessage } from '@/utils/message'
export default {
    name: 'SideBar',
    data() {
        return {
        }
    },
    computed: {
        list() {
            return this.$router.options.routes.find(item => item.name == 'home').children.filter(item => item.meta)
        }
    },
    props: {
        to: {
            type: String | Number,
            default: "2023"
        },
        isMobile: {
            type: Boolean,
        }
    },
    methods: {
        formatMessage,
        filterMessage,
        notice() {
            this.$alert(this.formatMessage(`请务必使用\`Edge\`或\`Chrome\`浏览器打开🎊，移动端适配尚不完全，非必要请不要使用！\n- 语音功能需长按按钮，连续说完话后等待1~2s后再释放才能获取到语音识别结果😟\n- 在聊天界面点击自己头像可以更改个人信息（<color:red>仅包含</color>用户名和头像）😊\n- 上传头像后（尚未提交），若想使用之前的头像，点击头像即可重置😎\n- 聊天、动态支持\`markdown\`语法❤，评论尚不支持（考虑到评论内容较短且没有必要）\n- 聊天界面左上角的关联图标可以切换为好友请求页面🧑‍🤝‍🧑\n- 点击搜索好友左边的*放大镜icon*可以切换为**添加好友**🙇‍♂️\n\n若对本项目有任何疑问，请发送邮件📧至[1137725646@qq.com](mailto:1137725646\@qq.com)`), '公告⚠', {
                dangerouslyUseHTMLString: true
            }).catch(e => { })
        }
    }
}
</script>

<style lang="less" scoped>
.bar {
    width: fit-content;
    height: 100%;
    padding-left: 15px;
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        a {
            text-decoration: none;
            color: #333;
        }

        .item {
            list-style: none;
            padding: 5px 12px;
            border-radius: 5px;
            cursor: pointer;


            &.active {
                background-color: #C32F0144;

                .icon {
                    color: white;
                }

                .text {
                    color: white;
                }

                @media screen and (max-width: 600px) {
                    background-color: transparent;

                    .icon {
                        color: #C32F01;
                    }

                    .text {
                        color: #C32F01;
                    }
                }

            }

            &.disabled {

                &,
                * {
                    cursor: not-allowed;
                }
            }


            .icon {
                text-align: center;
                font-size: 22px;
                transition: none !important;
            }

            .text {
                text-align: center;
                white-space: nowrap;
                font-size: 12px;
            }

        }

    }

    .tool {
        padding-bottom: 20px;

        .item {
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .icon {
                height: 22px;
                width: 22px;
            }

            &:hover {
                color: #C32F01;
            }
        }
    }

    @media screen and (max-width: 600px) {
        flex-direction: row;

        .list {
            justify-content: space-around !important;
        }

        .tool {
            padding-bottom: 0;

            .item {
                color: black;
                display: block;
                height: 100%;

                .icon {
                    height: auto;
                    width: auto;
                }

                &.github {
                    display: flex;

                    .icon {
                        height: 22px;
                        width: 22px;

                        img {
                            padding-top: 5px;
                        }
                    }

                }

            }
        }
    }
}
</style>