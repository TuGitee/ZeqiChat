<template>
  <div id="app">
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Footer: () => import("@/components/Footer")
  },
}
</script>

<style lang="less">
@font-face {
  font-family: 'BlackFont';
  src: url("./assets/font/BlackFont.ttf");
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
</style>
