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
  },
  computed: {
    ...mapState(['mode', 'tabs', 'navbarActive'])
  },
  methods: {
    ...mapActions([
      'addTab',
      'setNormalMode',
      'setInsertMode',
      'setCommandbarActive'
    ]),
    updateSize: function () {
      this.width = document.documentElement.clientWidth + 'px'
      this.height = document.documentElement.clientHeight + 'px'
    },
    activateCommandbar: function () {
      this.setCommandbarActive(true)
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
        this.$mousetrap.bind('f', this.find)
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
    find: function (ev) {
      this.$bus.$emit('activetab:find', ev)
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
