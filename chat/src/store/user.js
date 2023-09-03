const state = {
    username: '',
    avatar: '',
    token: '',
    userId: '',
}
const mutations = {
    SET_USERNAME: (state, username) => {
        state.username = username
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERID: (state, userId) => {
        state.userId = userId
    }
}
const actions= {
    login({ commit }, {username, avatar, token, userId}) {
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_TOKEN', token)
        commit('SET_USERID', userId)
        localStorage.setItem("token", token)
    },
    logout({ commit }) {
        commit('SET_USERNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        localStorage.removeItem("token")
    }
}
const getters = {
    username: state => state.username,
    avatar: state => state.avatar,
    token: state => state.token,
    userId: state => state.userId
}

export default {
    state,
    mutations,
    actions,
    getters
}