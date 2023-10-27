<template>
    <div class="game">
        <p class="loading" v-if="isLoading"><i class="el-icon-loading"></i> 模型加载中...</p>
        <canvas class="absolute" id="canvas3d" v-show="!isLoading"></canvas>
    </div>
</template>

<script>
import { Application } from '@splinetool/runtime';
export default {
    name: 'Game',
    data() {
        return {
            isLoading: true
        }
    },
    mounted() {
        const canvas = document.getElementById('canvas3d');
        const spline = new Application(canvas, {
            renderMode: 'auto',
        });
        spline.load('https://prod.spline.design/zFaH1NWGDW9gcEtD/scene.splinecode').then(() => {
            this.isLoading = false
        });
    },
}
</script>

<style lang="less" scoped>
.game {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>