<template>
    <div class="color">
        <input id="color" type="color" :value="color" @change="change" />
    </div>
</template>

<script>
export default {
    name: "ColorChange",
    props: {
        color: String
    },
    methods: {
        change(e) {
            this.$emit("changeColor", e.target.value);
            console.log(e.target.value);
        }
    }
}
</script>

<style lang="less" scoped>
.color {
    height: 30px;
    width: 30px;

    input {
        border: none;
        height: 100%;
        width: 100%;
        background-color: transparent;

        &::-webkit-color-swatch {
            border: none;
            height: 100%;
            width: 100%;
            border-radius: 5px;
        }
    }
}
</style>