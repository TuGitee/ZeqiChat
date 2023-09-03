import { io } from "@/assets/js/socketio.js";

const state = {
    server: null
}
const mutations = {
    SET_SERVER: (state, server, options = {
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnection: true,
        reconnectionAttempts: Infinity
    }) => {
        state.server = io(server, options)
    }
}
const actions = {
    setServer({ commit }, { server, options = {
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnection: true,
        reconnectionAttempts: Infinity
    } }) {
        commit('SET_SERVER', server, options)
    }
}
const getters = {
    server: state => state.server
}

export default {
    state,
    mutations,
    actions,
    getters
}