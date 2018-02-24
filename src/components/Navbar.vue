v<template>
  <div id="navbar">
    <i id="navbar-back" class="nav-icons" title="Go back" v-bind:class="{ disabled: !canGoBack }" @click="setGoBack(true)">
      <svg height="100%" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </i>

    <i id="navbar-forward" class="nav-icons" title="Go forward" v-bind:class="{ disabled: !canGoForward }" @click="setGoForward(true)">
      <svg height="100%" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    </i>

    <i id="navbar-reload" class="nav-icons" title="Reload page" @click="toggleReload">
      <svg v-if="loading" height="100%" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
      <svg v-else height="100%" viewBox="0 0 24 24" id="nav-ready">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </i>

    <input
      ref="address"
      id="navbar-url"
      type="text"
      title="Enter an address or search term"
      :value="inputUrl"
      @keyup.enter.exact="setUrl($event.target.value)"
      @keyup.enter="$event.target.blur()"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  data: function () {
    return {
      inputUrl: ''
    }
  },
  mounted: function () {
    this.inputUrl = this.url
  },
  computed: {
    ...mapGetters([
      'url',
      'loading',
      'canGoBack',
      'canGoForward'
    ])
  },
  methods: {
    ...mapActions([
      'setReload',
      'setStop',
      'setGoBack',
      'setGoForward',
      'setUrl'
    ]),
    toggleReload: function () {
      if (this.loading) {
        this.setStop(true)
      } else {
        this.setReload(true)
      }
    }
  },
  watch: {
    url: function (newUrl) { this.inputUrl = newUrl }
  }
}
</script>

<style scoped>
#navbar {
  display:flex; align-items:center;
  background-color: #f5f5f5;
  padding: 10px;
  font-family: arial;
  border-bottom: 1px solid #e2e2e2;
  box-sizing: border-box;
  height: 32px;
}

#navbar-back {
  fill:#000; width:24px; height:24px;
}

#navbar .nav-icons {
  margin: 0 4px;
}

#navbar-back.disabled {
  pointer-events:none;	opacity:0.5;
}

#navbar-forward {
  fill:#000; width:24px; height:24px;
}

#navbar-forward.disabled {
  pointer-events:none;	opacity:0.5;
}

#navbar-reload {
  fill:#000; width:24px; height:24px;
}

#navbar-url{
  box-sizing:border-box; flex:1; height:24px;
  box-shadow: 0 0 5px #e4e4e4;
  border: 0;
  border-radius: 3px;
  margin-left: 8px;
  font-size: 11pt;
  outline: none;
  padding-left: 10px;
  color: #b7b7b7;
  background-position: left;
  background-size: 35px 100%;
  background-repeat: no-repeat;
  background-color: #fff;
}

#navbar-url:focus {
  outline: -webkit-focus-ring-color auto 2px
}
</style>
