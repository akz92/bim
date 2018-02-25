<template>
  <webview
    plugins
    allowpopus
    nodeintegration
    preload="file:///Users/akz/dev/bim/src/components/webviewScript.js"
    ref="webview"
    :src="tab.url"
    v-show="active"
    @page-title-set="setTitle({ index, title: $event.title })"
    @did-start-loading="setLoading({ index, loading: true })"
    @did-stop-loading="setLoading({ index, loading: false })"
    @load-commit="evaluateNavigation"
    @did-navigate-in-page="setUrl({ index, url: $event.url })"
    @ipc-message="ipcHandler"
  ></webview>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Tab',
  props: ['index'],
  computed: {
    ...mapGetters({ findTab: 'tab' }),
    ...mapState(['mode', 'activeIndex']),
    active: function () { return this.index == this.activeIndex },
    tab: function () { return this.findTab(this.index) },
  },
  methods: {
    ipcHandler: function (ev) {
      if (ev.channel === 'focus') {
        this.setInsertMode()
      } else if (ev.channel === 'blur') {
        this.setNormalMode()
      }
    },
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
      'setNormalMode'
    ]),
    evaluateNavigation: function () {
      var canGoBack = this.$refs.webview.canGoBack(),
          canGoForward = this.$refs.webview.canGoForward()

      this.setCanGoBack({ index: this.index, canGoBack })
      this.setCanGoForward({ index: this.index, canGoForward })
    }
  },
  watch: {
    mode: function (mode) {
      if (mode === 'normal') {
        this.$refs.webview.blur()
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
    }
  }
}
</script>

<style scoped>
webview {
  height: calc(100% - 32px - 38px);
  width: 100%;
}
</style>
