const state = {
    x: 0,
    y: 0,
    menuList: [],
    isShow: false
}
const mutations = {
    SET_X: (state, x) => {
        state.x = x
    },
    SET_Y: (state, y) => {
        state.y = y
    },
    SET_MENU_LIST: (state, menuList) => {
        state.menuList = menuList
    },
    SET_IS_SHOW: (state, isShow) => {
        state.isShow = isShow
    },
    SET_STATE: (state, { x, y, menuList, isShow }) => {
        state.x = x || state.x
        state.y = y || state.y
        state.menuList = menuList || state.menuList
        state.isShow = isShow || state.isShow
        const muneDom = document.querySelector('#context-menu')
        setTimeout(() => {
            if (muneDom) {
                const height = muneDom.offsetHeight
                const width = muneDom.offsetWidth
                const bodyHeight = document.documentElement.clientHeight
                const bodyWidth = document.documentElement.clientWidth
                if (y + height > bodyHeight) {
                    state.y = bodyHeight - height
                }
                if (x + width > bodyWidth) {
                    state.x = bodyWidth - width
                }
            }
        })

    }
}
const actions = {
    setMenuList({ commit }, menuList) {
        commit('SET_MENU_LIST', menuList)
    },
    setX({ commit }, x) {
        commit('SET_X', x)
    },
    setY({ commit }, y) {
        commit('SET_Y', y)
    },
    setIsShow({ commit }, isShow) {
        commit('SET_IS_SHOW', isShow)
    }
}
const getters = {
}

export default {
    state,
    mutations,
    actions,
    getters
}