<template>
  <div id="app" v-bind:style="{ width: width, height: height }">
    <Tabs/>
    <Navbar/>
    <Tab v-for="(tab, index) in tabs" :key="index" :index="index"/>
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
    ...mapState(['mode', 'tabs'])
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
      } else if (this.mode == 'insert') {
        this.$mousetrap.unbind(':')
        this.$mousetrap.unbind('i')
      }
    },
    openUrl: function (ev, url) {
      this.addTab({ url })
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
