import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import router from './router'

import axios from './api'
Vue.prototype.$axios = axios

import hl from 'highlight.js'
hl.configure({
  ignoreUnescapedHTML: true,
})
import { lineNumbersBlock } from '@/assets/js/hljs-number'

Vue.directive('highlight', function (el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    if (block.getAttribute('data-line-numbers')) return;
    hl.highlightBlock(block);
    block.setAttribute('data-line-numbers', 'true');
    lineNumbersBlock(block);
  })
})

import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

Vue.component(CollapseTransition.name, CollapseTransition)

import { Notification, MessageBox, Loading, Message } from 'element-ui';
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message


Vue.use(Loading);
Vue.use(Loading.directive);

import Firework from '@/components/Firework'
Vue.component(Firework.name, Firework)

import preview from 'vue-photo-preview'
import "vue-photo-preview/dist/skin.css"

import "@/less/emoji/iconfont.css"

const options = {
  fullscreenEl: false,
  closeEl: false,
  tapToClose: true,
  zoomEl: false, //控制是否显示放大缩小按钮
  shareEl: false,
  counterEl: false,
  tapToToggleControls: true,
  clickToCloseNonZoomable: true,
  indexIndicatorSep: ' / '
}
Vue.use(preview, options)

import store from './store'


new Vue({
  render: h => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  store
}).$mount('#app')
