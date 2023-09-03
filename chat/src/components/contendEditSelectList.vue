<template>
  <ul class="contendEditSelectList" :style="{ left: left }">
    <li v-for="(item, i) in list" :key="i" class="selectItem" :class="{ on: (i + 1) === selectItemIndex }" code=item
      @click="itemClick(item)">
      {{ selectDataList[item] }}
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    left: {
      type: String,
      default: "0px"
    },
    selectItemIndex: {
      type: Number,
      default: 0
    },
    selectDataList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    itemClick(str) {
      this.$emit("itemClick", str)
    }
  },
  computed: {
    list() {
      return Object.keys(this.selectDataList)
    }
  }
}
</script>
<style lang="less" scoped>
.contendEditSelectList {
  border-radius: 2px;
  position: absolute;
  bottom: -92px;
  z-index: 99;
  padding: 5px;
  margin: 0;
  overflow: hidden;
  background: white;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  border-radius: 5px;

  .selectItem {
    cursor: pointer;
    flex: 1 0 100px;
    width: 100%;
    padding: 0 10px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #333;
    border-radius: inherit;
    transition: none !important;

    &:hover {
      background: #5a81ff;
      color: white;
    }

    &.on {
      background: #5a81ff;
      color: white;
    }
  }
}
</style>
