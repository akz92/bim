<template>
  <webview ref="webview" :src="url" v-show="active"></webview>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Tab',
  props: ['index'],
  mounted: function () {
    const webview = this.$refs.webview

    webview.addEventListener('page-title-set', this.titleSet)
    webview.addEventListener('did-start-loading', this.startedLoading)
    webview.addEventListener('did-stop-loading', this.stoppedLoading)
    webview.addEventListener('load-commit', this.evaluateNavigation)
    webview.addEventListener('did-navigate-in-page', this.urlChanged)
  },
  methods: {
    titleSet: function (e) { this.$emit('title-changed', e.title) },
    startedLoading: function () { this.$emit('is-loading', true) },
    stoppedLoading: function () { this.$emit('is-loading', false) },
    urlChanged: function (e) { this.$emit('url-changed', e.url) },
    evaluateNavigation: function () {
      this.$emit('can-go-back', this.$refs.webview.canGoBack())
      this.$emit('can-go-forward', this.$refs.webview.canGoForward())
    }
  },
  computed: {
    ...mapGetters([
      'tab',
      'activeIndex'
    ]),
    url: function () { this.tab(this.index).url },
    active: function () { return this.index == this.activeIndex }
  },
  watch: {
    // TODO: Figure out how to trigger reload
    // 'tab.loading': function (loading) {
    //   if (loading) {
    //     this.$refs.webview.loadURL(this.url)
    //   } else {
    //     this.$refs.webview.stop()
    //   }
    // }
  }
}
</script>

<style scoped>
webview {
  height: 100%;
  width: 100%;
}
</style>
