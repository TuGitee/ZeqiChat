<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1rem;
}

* {
  -webkit-tap-highlight-color: transparent;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  font-family: "Roboto", sans-serif;
  -webkit-user-drag: none;
  transition: all 0.5s;
  max-width: 100%;

  ::-webkit-scrollbar {
    height: 3px;
    width: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #fff5f597;
    border-radius: 10px;
  }

}
</style>
