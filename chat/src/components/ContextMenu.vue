<template>
    <div class="context-menu" id="context-menu" :style="{
        top: `${y}px`,
        left: `${x}px`,
    }" v-show="isShow" @click.prevent.stop>
        <div class="menu-list">
            <button v-for="item in menuList" :key="item.label" class="menu-item" @click.capture="handleSelect(item)"
                :disabled="item.disabled" @contextmenu.prevent.stop>
                <i class="icon" :class="item.icon"></i>
                {{ item.label }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ContextMenu',
    methods: {
        handleSelect(item) {
            this.$emit('select', item)
        }
    },
    computed: {
        ...mapState({
            x: state => state.menu.x,
            y: state => state.menu.y,
            menuList: state => state.menu.menuList,
            isShow: state => state.menu.isShow,
        })
    }
}
</script>

<style scoped lang="less">
.context-menu {
    position: fixed;
    z-index: 99999;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    transition: none !important;

    .menu-list {
        list-style: none;
        padding: 5px;
        margin: 0;
        display: flex;
        flex-direction: column;

        .menu-item {
            padding: 5px 20px 5px 10px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            border-radius: 4px;
            text-align: left;
            transition: none !important;
            white-space: nowrap;
            outline: none;
            background-color: transparent;
            border: none;

            &:not(:last-child) {
                margin-bottom: 2px;
            }

            &:hover {
                background-color: #5a81ff;
                color: white;
            }

            &:disabled {
                color: #ccc;
                cursor: not-allowed;

                &:hover {
                    background-color: transparent;
                    color: #ccc;
                }
            }

            .icon {
                margin-right: 5px;
                transition: none !important;
            }
        }
    }

    &.mobile {
        max-width: 50%;
        width: fit-content;

        .menu-list {
            flex-direction: row;
            flex-wrap: wrap;
            width: fit-content;

            .menu-item {
                flex: 1;
            }
        }
    }
}
</style>