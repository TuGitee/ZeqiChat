<template>
    <div class="net">
        <div class="net-type">Type:{{ netInfo.rtt <= 0 ? '无网络' : netInfo.effectiveType }}</div>
                <div class="net-rtt">RTT:{{ netInfo.rtt }}</div>
                <div class="net-status">
                    <div class="net-status-strength">
                        <div class="net-status-strength-bar" v-for="i in 3" :key="i"
                            :style="{ height: 33 * i + '%', backgroundColor: strength >= i ? strengthColor : '' }"></div>
                    </div>
                </div>
        </div>
</div></template>

<style lang="less" scoped>
.net {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 14px;
    font-weight: bold;
    user-select: none;

    .net-type {
        font-size: 12px;
    }

    .net-rtt {
        font-size: 12px;
    }

    .net-status {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;

        .net-status-strength {
            display: flex;
            align-items: flex-end;
            gap: 2px;
            height: 20px;
            box-sizing: content-box;
            padding: 5px;
            background-color: #fffa;
            border-radius: 5px;
            box-shadow: 1px 1px 2px #000;

            &-bar {
                width: 5px;
                background-color: #eee8;
                box-shadow: 1px 1px 2px #000;
            }
        }
    }
}
</style>

<script>
export default {
    name: 'Net',
    data() {
        return {
            netInfo: {
                rtt: 0,
                effectiveType: ''
            },
        }
    },
    computed: {
        strength() {
            return this.netInfo.rtt <= 0 ? 0 : this.netInfo.rtt <= 150 ? 3 : this.netInfo.rtt <= 550 ? 2 : 1
        },
        strengthColor() {
            return this.strength == 3 ? '#0edb0e' : this.strength == 2 ? '#ff7f00' : this.strength == 1 ? '#ff0000' : 'transparent'
        },
    },
    mounted() {
        const net = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        net.addEventListener('change', (e) => {
            this.netInfo.effectiveType = e.target.effectiveType
            this.netInfo.rtt = e.target.rtt
        })
        this.netInfo.effectiveType = net.effectiveType
        this.netInfo.rtt = net.rtt
    }
}
</script>