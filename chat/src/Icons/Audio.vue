<template>
    <div class="audio" :class="{ active }">
        <div class="audio-item" v-for="i in 4" :key="i" :style="{ '--delay': getRandom(0.3, 1) }"></div>
    </div>
</template>

<script>
export default {
    props: {
        active: Boolean
    },
    methods: {
        getRandom(min, max) {
            return Math.random() * (max - min) + min
        }
    }
}
</script>

<style lang="less">
.audio {
    height: 16px;
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-direction: row;
    user-select: none;
    cursor: pointer;

    .audio-item {
        width: 3px;
        height: calc(100% * var(--delay, 100%));
        background-color: #333;
        transform-origin: center;
        margin: 1px;
    }

    &.active {
        .audio-item {
            animation: play 1s linear infinite;
            animation-delay: calc(-1s * var(--delay));

            @keyframes play {
                0% {
                    transform: scaleY(1 / var(--delay));
                }

                50% {
                    transform: scaleY(0.5);
                }

                100% {
                    transform: scaleY(1 / var(--delay));
                }
            }
        }
    }
}
</style>