<template>
  <webview
    plugins
    preload="file:///Users/akz/dev/bim/src/utils/webview-preloader.js"
    ref="webview"
    :src="url"
    v-bind:class="{ active, 'with-navbar': navbarActive }"
    @page-title-set="setTitle({ index, title: $event.title })"
    @did-start-loading="setLoading({ index, loading: true })"
    @did-stop-loading="setLoading({ index, loading: false })"
    @did-navigate-in-page="updateUrl"
    @ipc-message="ipcHandler"
    @dom-ready="evaluateNavigation"
    @new-window="addTab({ url: $event.url })"
    @load-commit="updateUrl"
    @did-fail-load=""
  ></webview>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Tab',
  props: ['index'],
  data: function () {
    return {
      url: null
    }
  },
  mounted: function () {
    this.url = this.tab.url
  },
  computed: {
    ...mapGetters({ findTab: 'tab' }),
    ...mapState(['mode', 'activeIndex', 'navbarActive']),
    active: function () { return this.index == this.activeIndex },
    tab: function () { return this.findTab(this.index) },
  },
  methods: {
    ...mapActions([
      'setTitle',
      'setUrl',
      'setLoading',
      'setCanGoBack',
      'setCanGoForward',
      'setReload',
      'setStop',
      'setGoBack',
      'setGoForward',
      'setInspect',
      'setInsertMode',
      'setNormalMode',
      'addTab',
      'setFocusWebview',
      'setUpdateWebviewUrl',
      'setScrollToTop',
      'setScrollToBottom',
      'setScrollUpHalfPage',
      'setScrollDownHalfPage'
    ]),
    ipcHandler: function (ev) {
      if ((ev.channel === 'window:focus') && (this.mode === 'normal')) {
        this.setInsertMode()
      } else if ((ev.channel === 'window:blur') && (this.mode === 'insert')) {
        this.setNormalMode()
      } else if (ev.channel === 'hint:close') {
        this.setNormalMode()
      } else if (ev.channel === 'hint:focusinput') {
        this.setInsertMode()
      }
    },
    evaluateNavigation: function () {
      var canGoBack = this.$refs.webview.canGoBack(),
          canGoForward = this.$refs.webview.canGoForward()

      this.setCanGoBack({ index: this.index, canGoBack })
      this.setCanGoForward({ index: this.index, canGoForward })
    },
    updateUrl: function () {
      this.setUrl({ index: this.index, url: this.$refs.webview.getURL() })
    }
  },
  watch: {
    mode: function (mode, previousMode) {
      if (mode === 'normal') {
        this.$refs.webview.blur()
      }

      if (mode === 'hint' && this.active) {
        this.$refs.webview.focus()
        this.$refs.webview.send('hints:show')
      }

      if (previousMode === 'hint') {
        this.$refs.webview.send('hints:hide')
      }
    },
    'tab.reload': function (reload) {
      if (reload && this.tab.url) {
        this.$refs.webview.loadURL(this.tab.url)
        this.setReload(false)
      }
    },
    'tab.stop': function (stop) {
      if (stop) {
        this.$refs.webview.stop()
        this.setStop(false)
      }
    },
    'tab.goBack': function (goBack) {
      if (goBack) {
        this.$refs.webview.goBack()
        this.setGoBack(false)
      }
    },
    'tab.goForward': function (goForward) {
      if (goForward) {
        this.$refs.webview.goForward()
        this.setGoForward(false)
      }
    },
    'tab.inspect': function (inspect) {
      if (inspect) {
        this.$refs.webview.openDevTools()
        this.setInspect(false)
      }
    },
    'tab.focusWebview': function (focus) {
      if (focus) {
        if (this.mode !== 'normal') {
          this.$refs.webview.focus()
        }

        this.setFocusWebview(false)
      }
    },
    'tab.updateWebviewUrl': function (updateWebviewUrl) {
      if (updateWebviewUrl) {
        this.url = this.tab.url
        this.setUpdateWebviewUrl({ index: this.index, update: false })
      }
    },
    'tab.scrollToTop': function (scroll) {
      if (scroll) {
        this.$refs.webview.send('scroll:top')
        this.setScrollToTop(false)
      }
    },
    'tab.scrollToBottom': function (scroll) {
      if (scroll) {
        this.$refs.webview.send('scroll:bottom')
        this.setScrollToBottom(false)
      }
    },
    'tab.scrollUpHalfPage': function (scroll) {
      if (scroll) {
        this.$refs.webview.send('scroll:up:halfpage')
        this.setScrollUpHalfPage(false)
      }
    },
    'tab.scrollDownHalfPage': function (scroll) {
      if (scroll) {
        this.$refs.webview.send('scroll:down:halfpage')
        this.setScrollDownHalfPage(false)
      }
    }
  }
}
</script>

<style scoped>
webview {
  height: calc(100% - 38px);
  width: 100%;
  position: fixed;
  opacity: 0;
}

webview.active {
  z-index: 1;
  opacity: 1;
}

webview.with-navbar {
  height: calc(100% - 32px - 38px);
}
</style>
