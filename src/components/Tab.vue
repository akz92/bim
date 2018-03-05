<template>
  <webview
    plugins
    preload="file:///Users/akz/dev/bim/src/utils/webview-preloader.js"
    ref="webview"
    :src="tab.webviewUrl"
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
      'setFocusWebview'
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
        this.$refs.webview.executeJavaScript('linkHints.activateLinkHintsMode()')
      }

      if (previousMode === 'hint') {
        this.$refs.webview.executeJavaScript('linkHints.deactivateLinkHintsMode()')
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
