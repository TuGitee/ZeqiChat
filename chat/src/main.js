import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import router from './router'

import axios from './api'
Vue.prototype.$axios = axios

import hl from 'highlight.js'
hl.configure({
  ignoreUnescapedHTML: true
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

import Firework from '@/components/Firework'
Vue.component(Firework.name, Firework)

new Vue({
  render: h => h(App),
  router,
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')
