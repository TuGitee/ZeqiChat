<template>
    <div class="game">
        <canvas class="absolute" id="canvas3d"></canvas>
    </div>
</template>

<script>
import { Application } from '@splinetool/runtime';
export default {
    name: 'Game',
    mounted() {
        const canvas = document.getElementById('canvas3d');
        const spline = new Application(canvas, {
            renderMode: 'auto',
        });
        spline.load('https://prod.spline.design/zFaH1NWGDW9gcEtD/scene.splinecode');
    },
}
</script>