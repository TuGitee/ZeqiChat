<template>
    <div>
        <TimeItem v-if="msg.delta > 3 * 60 * 1000" :time="msg.create_time"></TimeItem>
        <MessageItem :msg="msg" :isUserName="isUserName"></MessageItem>
    </div>
</template>

<script>
import MessageItem from "./MessageItem";
import TimeItem from "./TimeItem";
export default {
    name: "ChatItem",
    components: {
        MessageItem,
        TimeItem
    },
    props: {
        msg: {
            type: Object,
            default: () => { }
        },
        isUserName: {
            type: Boolean,
            default: false
        }
    }
}
</script>