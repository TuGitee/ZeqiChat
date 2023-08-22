<template>
    <div class="root" ref="root">
        <canvas id="n"></canvas>
        <div id="t">{{ text }}</div>
    </div>
</template>

<script>
export default {
    name: 'Firework',
    props: {
        text: String
    },
    mounted() {
        const that = this
        let n, m, w, h, v = [], p = .1, xp, yp;
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (c) { window.setTimeout(c, 16) };
        l();
        function l() {
            n = document.getElementById("n");
            window.addEventListener("resize", r);
            m = n.getContext("2d");
            r();
            requestAnimationFrame(b);
            window.addEventListener('click', fc);
            window.addEventListener('touchstart', fc)
        }
        function r() {
            if (!!n) {
                w = n.width = that.$refs?.root?.getBoundingClientRect().width;
                h = n.height = that.$refs?.root?.getBoundingClientRect().height
            }
        }

        function fc(e) {
            xp = e.pageX;
            yp = e.pageY;
            cf(xp, yp)
        }
        function b() {
            u();
            d();
            requestAnimationFrame(b)
        }
        function u() {
            if (v.length < n.width && Math.random() < p) cf();
            let a = [];
            for (let i = 0; i < v.length; i++) {
                if (v[i].m())
                    a.push(v[i])
            }
            v = a
        }
        function d() {
            m.globalCompositeOperation = 'source-over';
            m.fillStyle = "#0002";
            m.fillRect(0, 0, w, h);
            m.globalCompositeOperation = 'lighter';
            for (let i = 0; i < v.length; i++) {
                v[i].d(m)
            }
        }
        function cf(x, y) {
            xp = x || Math.random() * (w - 200) + 100;
            yp = y || Math.random() * (h - 200) + 100;
            let e = Math.random() * 50 + 100;
            let c = "rgb(" + ~~(Math.random() * 200 + 55) + "," + ~~(Math.random() * 200 + 55) + "," + ~~(Math.random() * 200 + 55) + ")";
            for (let i = 0; i < e; i++) {
                let o = new Pt();
                o.c = c;
                let vy = Math.sqrt(25 - o.vx * o.vx);
                if (Math.abs(o.vy) > vy) {
                    o.vy = o.vy > 0 ? vy : -vy
                }
                v.push(o)
            }
        }
        class Pt {
            g = .08;
            constructor() {
                this.w = this.h = Math.random() * 4 + 1;
                this.x = xp - this.w / 2;
                this.y = yp - this.h / 2;
                this.vx = (Math.random() - .5) * 10;
                this.vy = (Math.random() - .5) * 10;
                this.t = Math.random() * .5 + .5;
                this.c
            };
            m() {
                this.x += this.vx;
                this.vy += this.g;
                this.y += this.vy;
                this.t -= .01;
                if (this.x <= -this.w || this.x >= n.width || this.y >= n.height || this.t <= 0)
                    return false;
                return true
            };
            d(c) {
                c.save();
                c.beginPath();
                c.translate(this.x + this.w / 2, this.y + this.h / 2);
                c.arc(0, 0, this.w, 0, Math.PI * 2);
                c.fillStyle = this.c;
                c.globalAlpha = this.t;
                c.closePath();
                c.fill();
                c.restore()
            }
        }
    }
}
</script>

<style scoped lang="less">
.root {
    opacity: 0.3;
    position: absolute;
    inset: 0;
    z-index: 999;
}

#t {
    position: absolute;
    inset: 0;
    margin: auto;
    height: fit-content;
    width: fit-content;
    font-size: 10vmin;
    letter-spacing: .5rem;
    font-weight: bold;
    filter: drop-shadow(0px 0px 5px #000);
    pointer-events: none;
}
</style>