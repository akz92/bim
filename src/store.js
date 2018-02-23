import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabs: [],
    activeIndex: null
  },
  getters: {
    tabs: (state) => state.tabs,
    activeIndex: (state) => state.activeIndex,
    url: (state) => 'url',
    loading: (state) => true,
    canGoBack: (state) => true,
    canGoForward: (state) => false,
    tab: (state) => (index) => state.tabs[index]
  },
  actions: {
    addTab ({ commit }, customConfig = {}) {
      const config = {
        url: '',
        loading: false,
        title: '...',
        canGoBack: false,
        canGoForward: false,
        ...customConfig,
      }

      commit('ADD_TAB', config)
      commit('SET_ACTIVE_INDEX', 0)
    },
    setActiveIndex ({ commit }, index) {
      commit('SET_ACTIVE_INDEX', index)
    },
    changeUrl ({ commit }, url) {
      commit('CHANGE_URL', url)
    }
  },
  mutations: {
    ADD_TAB (state, tabConfig) {
      state.tabs = [...tabs, tabConfig]
    },
    SET_ACTIVE_INDEX (state, index) {
      state.activeIndex = index
    },
    CHANGE_URL (state, url) {
      state.tabs[state.activeIndex].url = url
    }
  }
})
