import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import urlRegex from 'url-regex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabs: [],
    activeIndex: null
  },
  getters: {
    tab: (state) => (index) => state.tabs[index],
    // TODO: Improve activeTab properties getters
    url: (state) => state.tabs[state.activeIndex] && state.tabs[state.activeIndex].url,
    loading: (state) => state.tabs[state.activeIndex] && state.tabs[state.activeIndex].loading,
    canGoBack: (state) => state.tabs[state.activeIndex] && state.tabs[state.activeIndex].canGoBack,
    canGoForward: (state) => state.tabs[state.activeIndex] && state.tabs[state.activeIndex].canGoForward,
  },
  actions: {
    addTab ({ commit, dispatch, state }, options = {}) {
      const tab = {
        url: null,
        loading: false,
        title: '...',
        canGoBack: false,
        canGoForward: false,
        reload: false,
        stop: false,
        goBack: false,
        goForward: false,
        ...options
      }

      if (tab.url) { tab.url = formatUrl(tab.url) }

      commit('ADD_TAB', tab)
      dispatch('setActiveIndex', state.tabs.indexOf(tab))
    },
    closeTab ({ commit, dispatch, state }, index) {
      commit('CLOSE_TAB', index)

      if (state.tabs.length < 1) {
        dispatch('setActiveIndex', null)
      } else if (index <= state.activeIndex) {
        dispatch('setActiveIndex', state.activeIndex - 1)
      }
    },
    setActiveIndex ({ commit, state }, index) {
      commit('SET_ACTIVE_INDEX', index)
    },
    setUrl ({ commit, state }, url, index) {
      index = index || state.activeIndex

      commit('SET_URL', { url: formatUrl(url), index })
    },
    setTitle ({ commit, state }, title, index) {
      index = index || state.activeIndex
      commit('SET_TITLE', { title, index })
    },
    setLoading ({ commit, state }, loading, index) {
      index = index || state.activeIndex
      commit('SET_LOADING', { loading, index })
    },
    setCanGoBack ({ commit, state }, canGoBack, index) {
      index = index || state.activeIndex
      commit('SET_CAN_GO_BACK', { canGoBack, index })
    },
    setCanGoForward ({ commit, state }, canGoForward, index) {
      index = index || state.activeIndex
      commit('SET_CAN_GO_FORWARD', { canGoForward, index })
    },
    setReload ({ commit }, reload) {
      commit('SET_RELOAD', reload)
    },
    setStop ({ commit }, stop) {
      commit('SET_STOP', stop)
    },
    setGoBack ({ commit }, goBack) {
      commit('SET_GO_BACK', goBack)
    },
    setGoForward ({ commit }, goForward) {
      commit('SET_GO_FORWARD', goForward)
    }
  },
  mutations: {
    ADD_TAB (state, tab) {
      state.tabs.push(tab)
    },
    CLOSE_TAB (state, index) {
      state.tabs.splice(index, 1)
    },
    SET_ACTIVE_INDEX (state, index) {
      state.activeIndex = index
    },
    SET_URL (state, { url, index }) {
      state.tabs[index].url = url
    },
    SET_TITLE (state, { title, index }) {
      state.tabs[index].title = title
    },
    SET_LOADING (state, { loading, index }) {
      state.tabs[index].loading = loading
    },
    SET_CAN_GO_BACK (state, { canGoBack, index }) {
      state.tabs[index].canGoBack = canGoBack
    },
    SET_CAN_GO_FORWARD (state, { canGoForward, index }) {
      state.tabs[index].canGoForward = canGoForward
    },
    SET_RELOAD (state, reload) {
      state.tabs[state.activeIndex].reload = reload
    },
    SET_STOP (state, stop) {
      state.tabs[state.activeIndex].stop = stop
    },
    SET_GO_BACK (state, goBack) {
      state.tabs[state.activeIndex].goBack = goBack
    },
    SET_GO_FORWARD (state, goForward) {
      state.tabs[state.activeIndex].goForward = goForward
    }
  },
  plugins: [createPersistedState()]
})

// TODO: Move to utilities folder
function formatUrl (url) {
  if(urlRegex({ strict: false, exact: true }).test(url)) {
    url = (url.match(/^https?:\/\/.*/)) ? url : 'http://' + url
  } else {
    url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.google.com/search?q=' + url.replace(' ', '+') : url
  }

  return url
}
