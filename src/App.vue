<template>
  <div id="app" v-bind:style="{ width, height }">
    <Tabs/>
    <Navbar v-if="navbarActive"/>
    <Tab v-for="(tab, index) in tabs" :key="tab.id" :index="index"/>
    <Commandbar/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Tabs from './components/Tabs'
import Tab from './components/Tab'
import Navbar from './components/Navbar'
import Commandbar from './components/Commandbar'

export default {
  name: 'App',
  data: function () {
    return {
      width: '',
      height: ''
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.updateSize)
    this.updateSize()
    this.handleShortcuts()
    this.$mousetrap.bind('esc', this.setNormalMode)
    this.$electron.ipcRenderer.on('add-tab', this.openUrl)
    this.$electron.ipcRenderer.on('browser:focus', this.focusActiveWebview)
  },
  computed: {
    ...mapState(['mode', 'tabs', 'navbarActive'])
  },
  methods: {
    ...mapActions([
      'addTab',
      'setFocusWebview',
      'setNormalMode',
      'setInsertMode',
      'setHintMode',
      'setCommandbarActive',
      'setScrollToTop',
      'setScrollToBottom',
      'setScrollUpHalfPage',
      'setScrollDownHalfPage'
    ]),
    updateSize: function () {
      this.width = document.documentElement.clientWidth + 'px'
      this.height = document.documentElement.clientHeight + 'px'
    },
    activateCommandbar: function () {
      this.setCommandbarActive(true)
    },
    focusActiveWebview: function () {
      this.setFocusWebview(true)
    },
    handleShortcuts: function () {
      if (this.mode == 'normal') {
        this.$mousetrap.bind(':', this.activateCommandbar)
        this.$mousetrap.bind('i', this.setInsertMode)
        this.$mousetrap.bind('o', this.open)
        this.$mousetrap.bind('O', this.openTab)
        this.$mousetrap.bind('x', this.close)
        this.$mousetrap.bind('r', this.reload)
        this.$mousetrap.bind('H', this.back)
        this.$mousetrap.bind('L', this.forward)
        this.$mousetrap.bind('J', this.tabPrev)
        this.$mousetrap.bind('K', this.tabNext)
        this.$mousetrap.bind('y y', this.yank)
        this.$mousetrap.bind('w i', this.inspect)
        this.$mousetrap.bind('f', this.hints)
        this.$mousetrap.bind('G', this.scrollToBottom)
        this.$mousetrap.bind('g g', this.scrollToTop)
        this.$mousetrap.bind('ctrl+u', this.scrollUpHalfPage)
        this.$mousetrap.bind('ctrl+d', this.scrollDownHalfPage)
      } else {
        this.$mousetrap.unbind(':')
        this.$mousetrap.unbind('i')
        this.$mousetrap.unbind('o')
        this.$mousetrap.unbind('O')
        this.$mousetrap.unbind('x')
        this.$mousetrap.unbind('r')
        this.$mousetrap.unbind('H')
        this.$mousetrap.unbind('L')
        this.$mousetrap.unbind('J')
        this.$mousetrap.unbind('K')
        this.$mousetrap.unbind('y y')
        this.$mousetrap.unbind('w i')
        this.$mousetrap.unbind('f')
        this.$mousetrap.unbind('G')
        this.$mousetrap.unbind('g g')
        this.$mousetrap.unbind('ctrl+u')
        this.$mousetrap.unbind('ctrl+d')
      }
    },
    openUrl: function (ev, url) {
      this.addTab({ url })
    },
    open: function (ev) {
      this.$bus.$emit('commandbar:open', ev)
    },
    openTab: function (ev) {
      this.$bus.$emit('commandbar:open-tab', ev)
    },
    close: function (ev) {
      this.$bus.$emit('commandbar:close', ev)
    },
    reload: function (ev) {
      this.$bus.$emit('commandbar:reload', ev)
    },
    back: function (ev) {
      this.$bus.$emit('commandbar:back', ev)
    },
    forward: function (ev) {
      this.$bus.$emit('commandbar:forward', ev)
    },
    tabNext: function (ev) {
      this.$bus.$emit('commandbar:tab-next', ev)
    },
    tabPrev: function (ev) {
      this.$bus.$emit('commandbar:tab-prev', ev)
    },
    yank: function (ev) {
      this.$bus.$emit('commandbar:yank', ev)
    },
    inspect: function (ev) {
      this.$bus.$emit('commandbar:inspect', ev)
    },
    hints: function (ev) {
      this.setHintMode()
    },
    scrollToTop: function (ev) {
      this.setScrollToTop(true)
    },
    scrollToBottom: function (ev) {
      this.setScrollToBottom(true)
    },
    scrollUpHalfPage: function (ev) {
      this.setScrollUpHalfPage(true)
    },
    scrollDownHalfPage: function (ev) {
      this.setScrollDownHalfPage(true)
    }
  },
  watch: {
    mode: function () {
      this.handleShortcuts()
    }
  },
  components: {
    Tabs,
    Navbar,
    Tab,
    Commandbar
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
