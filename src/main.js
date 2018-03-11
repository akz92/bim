// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import Mousetrap from 'mousetrap'
import Fuse from 'fuse.js'
import _ from 'lodash'
const electron = window.require('electron')

Vue.config.productionTip = false
Vue.prototype.$mousetrap = Mousetrap
Vue.prototype.$electron = electron
Vue.prototype.$bus = new Vue()
Vue.prototype._ = _
Vue.prototype.$search = function (term, list, options) {
  return (new Fuse(list, options)).search(term)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
