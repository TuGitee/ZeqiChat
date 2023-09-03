import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

import user from "./user";
import mobile from './mobile';
import server from './server';
import menu from './menu';

export default new Vuex.Store({
    modules: {
        user,
        mobile,
        server,
        menu
    },
})
