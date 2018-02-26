// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import Mousetrap from 'mousetrap'
const electron = window.require('electron')

Vue.config.productionTip = false
Vue.prototype.$mousetrap = Mousetrap
Vue.prototype.$electron = electron
Vue.prototype.$bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
