const state = {
    isMobile: window.innerWidth < 600
}
const mutations = {
    SET_MOBILE: (state, isMobile) => {
        state.isMobile = isMobile
    }
}
const actions= {
    setMobile({ commit }, isMobile) {
        commit('SET_MOBILE', isMobile)
    }
}
const getters = {
    isMobile: state => state.isMobile
}

export default {
    state,
    mutations,
    actions,
    getters
}