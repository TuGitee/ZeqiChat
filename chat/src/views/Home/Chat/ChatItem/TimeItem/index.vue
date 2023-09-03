<template>
    <div class="time">
        {{ formatTime(time) }}
    </div>
</template>

<script>
import formatTime from '@/utils/formatTime';
export default {
    name: 'TimeItem',
    props: {
        time: {
            type: String | Date,
        }
    },
    methods: {
        formatTime
    }
}
</script>

<style lang="less" scoped>
.time {
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 2;
    padding: 5px 0 20px;
    user-select: none;
}
</style>