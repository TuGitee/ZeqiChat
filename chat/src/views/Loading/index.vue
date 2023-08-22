<template>
    <div class="loading">
        <h1 class="title">
            <span v-for="(text, index) in   title " :key="index" :style="{ '--i': index + 's' }">{{ text }}</span>
        </h1>
        <router-link to="/login">
            <p class="subtitle">
                <span v-for="(text, index) in subTitle" :key="index" :style="{ '--i': index + 's' }">{{ text }}</span>
            </p>
        </router-link>

        <p class="image">
            <Left class="left" @click.native="goBack" />
            <img src="@/assets/zeqi.png" alt="" @click="goHome" />
            <Left class="right" @click.native="goForward" />
        </p>
    </div>
</template>

<script>
export default {
    name: "Loading",
    data() {
        return {
            title: "择栖工作室",
            subTitle: "择栖CHAT"
        }
    },
    components: {
        Left: () => import("@/Icons/Left"),
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        goHome() {
            location.href = "https://zeqi.tech";
        },
        goForward() {
            this.$router.push("/login");
        }
    }
}
</script>

<style lang="less" scoped>
.loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #111;
    position: relative;
    overflow: hidden;
    user-select: none;

    .title,
    .subtitle {
        line-height: 1;
        padding: 3vmin;
        text-align: center;
        display: flex;
        margin: 0;
        padding-left: 6vmin;
    }

    .title span,
    .subtitle span {
        font-family: 'BlackFont';
        background: linear-gradient(90deg, #e42525 50%, transparent);
        font-size: 17vmin;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0;
        transform: translateX(100px);
        animation: animate 2s forwards;
        animation-delay: calc(var(--i) * 0.3);

        &:last-child {
            background-color: #e42525;
        }
    }

    .subtitle span {
        font-size: 9vmin;
        margin-left: 0;
    }

    @keyframes animate {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .image {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        margin-top: 20px;
        opacity: 0;
        transition: all .5s;
        transform: translateY(100px);
        animation: animate 2s forwards;

        .left {
            width: 5vmin;

            &:hover {
                transform: scale(1.2);
            }
        }

        .right {
            width: 5vmin;
            transform: rotate(180deg);
            animation: scale 2s infinite both;
            filter: drop-shadow(0 0 10px #e42525);

            /deep/ path {
                fill: #fff;
            }

            @keyframes scale {
                50% {
                    transform: rotate(180deg) scale(1.1);
                }
            }

            &:hover {
                transform: rotate(180deg) scale(1.2);
            }
        }

        img {
            width: 12vmin;
            height: 12vmin;
            background-color: white;
            border-radius: 50%;
            padding: 1vmin;

            &:hover {
                box-shadow: 0 10px 25px -5px #e42525;
                transform: translateY(-5px) scale(1.1);
            }
        }
    }
}
</style>