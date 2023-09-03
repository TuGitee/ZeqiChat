<template>
    <div class="icon">
        <svg t="1692198077177" :class="{ reverse: reverse }" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="14892" width="32" height="32">
            <path
                d="M96.469543 556.726671a71.940103 71.940103 0 0 1 0-89.453611l213.664799-255.966657 161.663152-192.648589c33.410385-39.876911 90.261926-11.585859 90.261926 44.726805v897.230492c0 56.312665-56.851542 84.603716-90.261926 44.726806l-161.663152-192.648589z"
                fill="#efefef" p-id="14893" data-spm-anchor-id="a313x.search_index.0.i0.472d3a81yXbKvp" class=""></path>
            <path
                d="M477.725143 556.726671a72.748418 72.748418 0 0 1 0-89.453611l213.934237-255.966657 161.663152-192.648589C885.924601-21.219097 943.045581 7.071955 943.045581 63.384619v897.230492c0 56.312665-57.12098 84.603716-90.261926 44.726806l-161.663152-192.648589z"
                fill="#efefef" p-id="14894" data-spm-anchor-id="a313x.search_index.0.i1.472d3a81yXbKvp" class=""></path>
        </svg>
        <p class="text">{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: "Chat",
    props: {
        text: {
            type: String
        },
        reverse: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less" scoped>
.icon {
    position: relative;

    .reverse {
        transform: rotate(180deg);
    }

    .text {
        color: transparent;
        position: absolute;
        transform: translateY(30px);
        white-space: nowrap;
        font-size: 14px;
        text-align: center;
        width: 100%;
    }

    svg:hover {
        cursor: pointer;

        &~.text {
            color: #fff;
            transform: translateY(10px);
        }
    }
}
</style>