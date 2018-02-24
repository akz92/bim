<template>
  <div id="app" v-bind:style="{ width: width, height: height }">
    <Tabs/>
    <Navbar/>
    <Tab v-for="(tab, index) in tabs" :key="index" :index="index"/>
    <Commandbar/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
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
  },
  computed: {
    ...mapState(['tabs'])
  },
  methods: {
    updateSize: function () {
      this.width = document.documentElement.clientWidth + 'px'
      this.height = document.documentElement.clientHeight + 'px'
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
