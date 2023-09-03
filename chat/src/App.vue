<template>
  <div id="app">
    <router-view></router-view>
    <Footer></Footer>
    <ContextMenu @select="handleSelect"></ContextMenu>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Footer: () => import("@/components/Footer"),
    ContextMenu: () => import("@/components/ContextMenu")
  },
  methods: {
    handleClick(e) {
      this.$store.commit('SET_IS_SHOW', false)
    },
    handleSelect(item) {
      this.$store.commit('SET_IS_SHOW', false)
      switch (item.command) {
        case 'chat':
          this.$bus.$emit('changeUser', item.id)
          break
        case 'blog':
          this.$router.push({
            name: 'blog',
            params: {
              id: item.id
            }
          })
          break
        case 'changeAvatar':
          this.$bus.$emit('changeAvatar')
          break
        case 'refresh':
          location.reload()
          break
        case 'copy':
          navigator.permissions.query({
            name: 'clipboard-write',
          }).then((result) => {
            if (result.state == 'granted') {
              navigator.clipboard.writeText(item.content).then(() => {
                this.$notify.success({
                  title: '成功',
                  message: '复制成功',
                  duration: 1000,
                  offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                })
              }).catch((error) => {
                this.$notify.error({
                  title: '失败',
                  message: error,
                  duration: 1000, 
                  offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                })
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '请授权复制权限!',
                duration: 1000,
                offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
              })
            }
          })

          break
        case 'recall':
          this.$bus.$emit('recall', item.id)
          break
        case 'delete':
          this.$bus.$emit('delete', item.id)
          break
        case 'add':
          this.$bus.$emit('addFriend')
          break
      }
    }
  },
  mounted() {
    window.addEventListener('click', this.handleClick)
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleClick)
  }
}
</script>

<style lang="less">
@font-face {
  font-family: 'BlackFont';
  src: url("./assets/font/BlackFont.ttf");
}

:root {
  --safe-top: constant(safe-area-inset-top);
  --safe-bottom: constant(safe-area-inset-bottom);
  --safe-left: constant(safe-area-inset-left);
  --safe-right: constant(safe-area-inset-right);
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-left: env(safe-area-inset-left);
  --safe-right: env(safe-area-inset-right);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1rem;

  a {
    text-decoration: none;
  }

  img {
    user-select: none;
    -webkit-user-drag: none;
  }

  * {
    transition: all 0.5s;
  }
}

* {
  -webkit-tap-highlight-color: transparent;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  font-family: "Roboto", sans-serif;
  -webkit-user-drag: none;
  max-width: 100%;

  ::-webkit-scrollbar {
    height: 3px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #fff5f597;
    border-radius: 10px;
  }



}

.el-message {
  @media screen and (max-width: 600px) {
    width: 90%;
    min-width: 0;
  }
}

.el-message-box {

  @media screen and (max-width: 600px) {
    width: 90%;
  }

  .el-message-box__title {
    font-weight: 700;
    font-size: 20px;
  }

  .el-message-box__message {
    @import url("./less/md_0.less");
  }
}

.el-dropdown-menu {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 25px;

    .avatar {
      height: 30px;
      width: 30px;

      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .username {
      flex: 1;
      line-height: 1.5;
    }
  }
}

.el-popper {
  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;

    .emoji-grid__item {
      cursor: pointer;
      text-decoration: none;
    }
  }

  .change-enter-list {
    padding: 0;

    .change-enter-item {
      padding: 10px;
      list-style: none;
      cursor: pointer;

      .icon {
        pointer-events: none;
        margin-right: 10px;
        width: 16px;
        display: inline-block;
      }

      &:hover {
        background-color: #eee;
        border-radius: 10px;
      }
    }
  }
}
</style>
