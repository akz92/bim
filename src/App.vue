<template>
  <div id="app" v-bind:style="{ width: width, height: height }">
    <Navbar
      @url-changed="changeUrl"
      @toggle-reload="toggleReload"
      @go-back="goBack"
      @go-forward="goForward"
    />
    <Tabs
      :tabs="tabs"
      @add-tab="addTab"
      @close-tab="closeTab"
      @activate-tab="setActiveIndex"
    />
    <Tab
      v-for="(tab, index) in tabs"
      :key="index"
      :index="index"
      @title-changed="changeTitle(index, $event)"
      @is-loading="changeLoading(index, $event)"
      @can-go-back="changeCanGoBack(index, $event)"
      @can-go-forward="changeCanGoForward(index, $event)"
      @url-changed="changeUrl($event, index)"
      />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Tabs from './components/Tabs'
import Tab from './components/Tab'
import Navbar from './components/Navbar'

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
    ...mapGetters([
      'tabs',
      'url',
      'loading',
      'canGoBack',
      'canGoForward'
    ])
  },
  methods: {
    ...mapActions([
      'addTab',
      'setActiveIndex',
      'changeUrl'
    ]),
    updateSize: function () {
      this.width = document.documentElement.clientWidth + 'px'
      this.height = document.documentElement.clientHeight + 'px'
    },
    closeTab: function (index) {
      // if (this.tabs[index].active) {
      //   if (index < this.tabs.length - 1) {
      //     this.activateTab(index + 1)
      //   } else if (index > 0) {
      //     this.activateTab(index - 1)
      //   } else {
      //     this.activeTab = null
      //   }
      // }

      this.tabs.splice(index, 1)
    },
    // activateTab: function (index) {
    //   if (this.activeTab) {
    //     this.activeTab.active = false
    //   }
    //
    //   this.activeTab = this.tabs[index]
    //   this.activeTab.active = true
    // },
    changeTitle: function (index, title) {
      this.tabs[index].title = title
    },
    changeLoading: function (index, loading) {
      this.tabs[index].loading = loading
    },
    toggleReload: function () {
      if (this.activeTab) {
        this.activeTab.loading = !this.activeTab.loading
      }
    },
    changeCanGoBack: function (index, canGoBack) {
      this.tabs[index].canGoBack = canGoBack
    },
    changeCanGoForward: function (index, canGoForward) {
      this.tabs[index].canGoForward = canGoForward
    },
    goBack: function () {
    },
    goForward: function () {
    }
  },
  components: {
    Tabs,
    Navbar,
    Tab
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
