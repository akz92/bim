import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import urlRegex from 'url-regex'
import uuid from 'uuid/v4'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabs: [],
    mode: 'normal',
    activeIndex: null,
    navbarActive: true,
    commandbarActive: false
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
    setCommandbarActive ({ commit }, commandbarActive) {
      commit('SET_COMMANDBAR_ACTIVE', commandbarActive)
    },
    setNavbarActive ({ commit }, navbarActive) {
      commit('SET_NAVBAR_ACTIVE', navbarActive)
    },
    setNormalMode ({ commit }) {
      commit('SET_MODE', 'normal')
    },
    setInsertMode ({ commit }) {
      commit('SET_MODE', 'insert')
    },
    setHintMode ({ commit }) {
      commit('SET_MODE', 'hint')
    },
    addTab ({ commit, dispatch, state }, options = {}) {
      const tab = {
        id: uuid(),
        url: null,
        updateWebviewUrl: false,
        loading: false,
        title: 'New Tab',
        canGoBack: false,
        canGoForward: false,
        reload: false,
        stop: false,
        goBack: false,
        goForward: false,
        inspect: false,
        focusWebview: false,
        ...options
      }

      if (tab.url) {
        tab.url = formatUrl(tab.url)
      }

      commit('ADD_TAB', tab)
      dispatch('setActiveIndex', state.tabs.indexOf(tab))
    },
    closeTab ({ commit, dispatch, state }, index) {
      commit('CLOSE_TAB', index)

      if (!state.tabs.length) {
        dispatch('setActiveIndex', null)
      } else if ((index < state.activeIndex) || (state.activeIndex > state.tabs.length - 1)) {
        dispatch('setActiveIndex', state.activeIndex - 1)
      }
    },
    setActiveIndex ({ commit, state }, index) {
      if (typeof index === 'string') {
        index = parseInt(index)
      }

      if (index < 0) {
        index = state.tabs.length - 1
      } else if (index > state.tabs.length - 1) {
        index = 0
      }

      commit('SET_ACTIVE_INDEX', index)
    },
    setUrl ({ commit, state, dispatch }, { url, index, updateWebview }) {
      commit('SET_URL', { url: formatUrl(url), index })

      if (updateWebview) {
        dispatch('setUpdateWebviewUrl', { index, update: true })
      }
    },
    setUpdateWebviewUrl ({ commit, state, dispatch }, { update, index }) {
      commit('SET_UPDATE_WEBVIEW_URL', { update, index })
    },
    setTitle ({ commit, state }, { title, index }) {
      commit('SET_TITLE', { title, index })
    },
    setLoading ({ commit, state }, { loading, index }) {
      commit('SET_LOADING', { loading, index })
    },
    setCanGoBack ({ commit, state }, { canGoBack, index }) {
      commit('SET_CAN_GO_BACK', { canGoBack, index })
    },
    setCanGoForward ({ commit, state }, { canGoForward, index }) {
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
    },
    setInspect ({ commit }, inspect) {
      commit('SET_INSPECT', inspect)
    },
    setFocusWebview({ commit }, focus) {
      commit('SET_FOCUS_WEBVIEW', focus)
    }
  },
  mutations: {
    SET_COMMANDBAR_ACTIVE (state, commandbarActive) {
      state.commandbarActive = commandbarActive
    },
    SET_NAVBAR_ACTIVE (state, navbarActive) {
      state.navbarActive = navbarActive
    },
    SET_MODE (state, mode) {
      state.mode = mode
    },
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
    SET_UPDATE_WEBVIEW_URL (state, { update, index }) {
      state.tabs[index].updateWebviewUrl = update
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
    },
    SET_INSPECT (state, inspect) {
      state.tabs[state.activeIndex].inspect = inspect
    },
    SET_FOCUS_WEBVIEW (state, focus) {
      state.tabs[state.activeIndex].focusWebview = focus
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
