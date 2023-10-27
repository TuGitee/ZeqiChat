<template>
    <div class="emoji">
        <router-link to="/">
            <div class="face" :class="{ anger: isAnger }">
                <div class="eyes">
                    <div class="eye"></div>
                    <div class="eye"></div>
                </div>
                <transition name="el-fade-in-linear">
                    <div class="shengqi" v-if="isAnger">💢</div>
                </transition>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'AngryFace',
    data() {
        return {
            isAnger: false,
        }
    },
    methods: {
        handleMouseMove(e) {
            const eyes = document.querySelectorAll('.eye')

            eyes.forEach(eye => {
                const x = (eye.getBoundingClientRect().left) + (eye.clientWidth / 2)
                const y = (eye.getBoundingClientRect().top) + (eye.clientHeight / 2)
                const atan = Math.atan2(-(e.pageX - x), -(e.pageY - y))
                const rot = (atan * (180 / Math.PI) * -1) + 0
                eye.style.transform = `rotate(${rot + 90}deg)`
            })
        },

        handleError() {
            clearTimeout(this.angerTimer)
            this.isAnger = true
            window.removeEventListener('mousemove', this.handleMouseMove)
            document.querySelectorAll('.eye').forEach((eye, index) => {
                eye.style.transition = 'all .5s'
                eye.style.transform = `rotate(${180 * (1 - index)}deg)`
            })
            this.angerTimer = setTimeout(() => {
                this.isAnger = false
                window.addEventListener('mousemove', this.handleMouseMove)
                document.querySelectorAll('.eye').forEach(eye => {
                    eye.style.transition = 'none'
                })
            }, 1000);
        },
    }, 
    mounted() {
        window.addEventListener('mousemove', this.handleMouseMove)
    },
    beforeDestroy() {
        window.removeEventListener('mousemove', this.handleMouseMove)
    },
}
</script>

<style lang="less" scoped>
.emoji {
    background-color: white;
    height: 60px;
    width: 60px;
    position: absolute;
    top: 40px;
    right: 40px;
    border-radius: 50%;

    .face {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #f1c40f;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:before {
            content: "";
            position: absolute;
            bottom: 18%;
            width: 50%;
            height: 10px;
            border-bottom-left-radius: 13px;
            border-bottom-right-radius: 13px;
            background-color: #b57700;
            transition: 0.5s;
        }

        &:hover {
            background: linear-gradient(180deg, #f44336, #ffcd00);

            &:before {
                height: 3px;
                bottom: 22.5%;
                background-color: #d35400;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        &.anger {
            background: linear-gradient(180deg, #e74c3c, #ff992c);

            &:before {
                height: 3px;
                bottom: 22.5%;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                background-color: #c0392b;
            }

        }

        .shengqi {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(25%, -25%);
            font-size: 20px;
        }

        .eyes {
            position: relative;
            top: -16%;
            display: flex;
            flex-wrap: wrap;

            .eye {
                position: relative;
                width: 20px;
                height: 20px;
                display: block;
                border-radius: 50%;
                background-color: white;
                margin: 0 0.1rem;
                transition: none !important;
                transform: rotate(-90deg);

                &:before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 5px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: black;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}
</style>