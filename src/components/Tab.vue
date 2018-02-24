<template>
  <webview
    ref="webview"
    :src="url"
    v-show="active"
    @page-title-set="setTitle($event.title, index)"
    @did-start-loading="setLoading(true, index)"
    @did-stop-loading="setLoading(false, index)"
    @load-commit="evaluateNavigation"
    @did-navigate-in-page="setUrl($event.url, index)"
  ></webview>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Tab',
  props: ['index'],
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
      'setGoForward'
    ]),
    evaluateNavigation: function () {
      this.setCanGoBack(this.$refs.webview.canGoBack(), this.index)
      this.setCanGoForward(this.$refs.webview.canGoForward(), this.index)
    }
  },
  computed: {
    ...mapGetters(['tab']),
    ...mapState(['activeIndex']),
    active: function () { return this.index == this.activeIndex },
    currentTab: function () { return this.tab(this.index) },
    url: function () { return this.currentTab.url },
    reload : function () { return this.currentTab.reload },
    stop : function () { return this.currentTab.stop },
    goBack : function () { return this.currentTab.goBack },
    goForward : function () { return this.currentTab.goForward }
  },
  watch: {
    reload: function (reload) {
      if (reload) {
        this.$refs.webview.loadURL(this.url)
        this.setReload(false)
      }
    },
    stop: function (stop) {
      if (stop) {
        this.$refs.webview.stop()
        this.setStop(false)
      }
    },
    goBack: function (goBack) {
      if (goBack) {
        this.$refs.webview.goBack()
        this.setGoBack(false)
      }
    },
    goForward: function (goForward) {
      if (goForward) {
        this.$refs.webview.goForward()
        this.setGoForward(false)
      }
    }
  }
}
</script>

<style scoped>
webview {
  height: 100%;
  width: 100%;
}
</style>
