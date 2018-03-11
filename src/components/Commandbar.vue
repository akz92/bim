<template>
  <div v-if="active">
    <div id="commandbar-suggestions" ref="suggestions" v-if="suggestions.length">
      <div
        class="suggestion"
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        v-bind:class="{ active: index === activeSuggestionIndex }"
      >
        {{suggestion.url}}
      </div>
    </div>

    <input
      id="commandbar"
      ref="commandbar"
      v-model="text"
      v-focus
      @blur="blur"
      @keyup.enter.exact="submit"
      @keyup.enter="blur"
      @keyup.escape="blur"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import commandParser from '../utils/command-parser'

export default {
  name: 'Commandbar',
  data: function () {
    return {
      text: null,
      suggestions: [],
      activeSuggestionIndex: -1
    }
  },
  mounted: function () {
    this.$bus.$on('commandbar:open', this.setOpen)
    this.$bus.$on('commandbar:open-tab', this.setOpenTab)
    this.$bus.$on('commandbar:close', this.setClose)
    this.$bus.$on('commandbar:reload', this.setReload)
    this.$bus.$on('commandbar:back', this.setBack)
    this.$bus.$on('commandbar:forward', this.setForward)
    this.$bus.$on('commandbar:tab-next', this.setTabNext)
    this.$bus.$on('commandbar:tab-prev', this.setTabPrev)
    this.$bus.$on('commandbar:yank', this.setYank)
    this.$bus.$on('commandbar:yank-hint', this.setYankHint)
    this.$bus.$on('commandbar:inspect', this.setInspect)
    this.$bus.$on('commandbar:hints', this.setHints)
    this.$bus.$on('commandbar:hints-tab', this.setHintsTab)
    this.$bus.$on('commandbar:focus', this.focusTab)
  },
  computed: {
    ...mapState({
      activeIndex: 'activeIndex',
      active: 'commandbarActive',
      history: 'history'
    }),
    ...mapGetters(['url']),
    suggestionsBottom: function () {
      return window.innerHeight - this.$refs.commandbar.offsetHeight
    },
    suggestionsTop: function () {
      return window.innerHeight - this.$refs.commandbar.offsetHeight - this.$refs.suggestions.offsetHeight;
    }
  },
  methods: {
    handleShortcuts: function () {
      this.$nextTick(function () {
        let trap = this.$mousetrap(this.$refs.commandbar)

        if (this.active) {
          trap.bind('ctrl+w', this.deleteWord)
          trap.bind('tab', this.activateSuggestion)
        } else {
          trap.unbind('ctrl+w')
          trap.unbind('tab')
        }
      })
    },
    activateSuggestion: function () {
      this.activeSuggestionIndex += 1

      if (this.activeSuggestionIndex > this.suggestions.length - 1) {
        this.activeSuggestionIndex = 0
      }

      return false
    },
    ensureActiveSuggestionIsVisible: function () {
      let sug = document.getElementsByClassName('suggestion active')[0]

      if (!this.isScrolledIntoView(sug)) {
        this.$refs.suggestions.scrollTop = (sug.offsetTop + sug.offsetHeight) - this.$refs.suggestions.offsetHeight
      }
    },
    isScrolledIntoView: function (el) {
      var rect = el.getBoundingClientRect();

      return (rect.top >= this.suggestionsTop) && (rect.bottom <= this.suggestionsBottom);
    },
    deleteWord: function () {
      let words =  this.text.split(' ')
      words.pop()
      this.text = words.join(' ') || this.text[0]
    },
    setOpen: function (ev) {
      ev.preventDefault()

      this.text = ':open '
      this.setCommandbarActive(true)
    },
    setOpenTab: function (ev) {
      ev.preventDefault()

      this.text = ':open -t '
      this.setCommandbarActive(true)
    },
    setClose: function (ev) {
      ev.preventDefault()

      this.text = ':tab-close'
      this.submit()
    },
    setReload: function (ev) {
      ev.preventDefault()

      this.text = ':reload'
      this.submit()
    },
    setBack: function (ev) {
      ev.preventDefault()

      this.text = ':back'
      this.submit()
    },
    setForward: function (ev) {
      ev.preventDefault()

      this.text = ':forward'
      this.submit()
    },
    setTabNext: function (ev) {
      ev.preventDefault()

      this.text = ':tab-next'
      this.submit()
    },
    setTabPrev: function (ev) {
      ev.preventDefault()

      this.text = ':tab-prev'
      this.submit()
    },
    setYank: function (ev) {
      ev.preventDefault()

      this.text = ':yank'
      this.submit()
    },
    setYankHint: function (ev) {
      ev.preventDefault()

      this.text = ':hints -y'
      this.submit()
    },
    setInspect: function (ev) {
      ev.preventDefault()

      this.text = ':inspect'
      this.submit()
    },
    setHints: function (ev) {
      ev.preventDefault()

      this.text = ':hints'
      this.submit()
    },
    setHintsTab: function (ev) {
      ev.preventDefault()

      this.text = ':hints -t'
      this.submit()
    },
    focusTab: function (ev, index) {
      ev.preventDefault()

      this.text = `:tab-focus ${index}`
      this.submit()
    },
    commandParser,
    ...mapActions([
      'setCommandbarActive',
      'setNavbarActive',
      'addTab',
      'setUrl',
      'closeTab',
      'setActiveIndex',
      'setGoBack',
      'setGoForward',
      'setReload',
      'setStop',
      'setInspect',
      'setHintMode',
      'setSearchMode',
      'changeTabIndex'
    ]),
    submit: function () {
      let prefix = this.text[0]

      if (prefix === ':') {
        this.handleCommand()
      } else if (prefix === '/') {
        this.handleSearch()
      }

      this.blur()
    },
    handleSearch: function () {
      this.setSearchMode(this.text.slice(1))
    },
    handleSuggestions: function () {
      let command = this.commandParser(this.text)
      this.suggestions = []
      this.activeSuggestionIndex = -1

      if (command.action === 'open' && command.argument) {
        let matched = this.$search(command.argument, this.history, {
          keys: ['title', 'url']
        })

        this.suggestions = this._.uniqBy(matched, 'url')
      }
    },
    handleCommand: function () {
      let command = this.commandParser(this.text)

      if (command.error) {
        // TODO: Display error message
        console.warn(command.error);
        return
      }

      if (command.prefix === ':') {
        switch(command.action) {
          case 'open':
            if ((command.flag === 't') || (typeof this.activeIndex !== 'number')) {
              this.addTab({ url: command.argument })
            } else {
              this.setUrl({
                url: command.argument,
                index: this.activeIndex,
                updateWebview: true
              })
            }
            break;
          case 'tab-close':
            let index = command.argument? parseInt(command.argument - 1) : this.activeIndex
            this.closeTab(index)
            break;
          case 'tab-focus':
            if (typeof command.argument === 'string') {
              this.setActiveIndex(parseInt(command.argument - 1))
            }
            break;
          case 'tab-next':
            this.setActiveIndex(this.activeIndex + 1)
            break;
          case 'tab-prev':
            this.setActiveIndex(this.activeIndex - 1)
            break;
          case 'tab-move':
            this.changeTabIndex({ currIndex: this.activeIndex, newIndex: command.argument - 1 })
            break;
          case 'back':
            this.setGoBack(true)
            break;
          case 'forward':
            this.setGoForward(true)
            break;
          case 'reload':
            this.setReload(true)
            break;
          case 'stop':
            this.setStop(true)
            break;
          case 'inspect':
            if (command.flag === 'b') {
              this.$electron.ipcRenderer.send('inspect')
            } else {
              this.setInspect(true)
            }
            break;
          case 'yank':
            // TODO: Display success message
            this.$electron.clipboard.writeText(this.url)
            break;
          case 'set':
            if (command.property === 'navbar') {
              this.setNavbarActive(command.value === 'show')
            }
            break;
          case 'hints':
            this.setHintMode({ tab: command.flag === 't', yank: command.flag === 'y' })
            break;
        }
      }
    },
    blur: function () {
      this.text = null

      if (this.$refs.commandbar) {
        this.$refs.commandbar.blur()
        this.setCommandbarActive(false)
      }
    }
  },
  watch: {
    active: function () {
      this.handleShortcuts()
      this.suggestions = []
      this.activeSuggestionIndex = -1
    },
    text: function (text) {
      if (!text) return

      if (text[0] === '/') {
        this.handleSearch()
      } else if (text[0] === ':') {
        this.handleSuggestions()
      }
    },
    activeSuggestionIndex: function (index) {
      if (index >= 0) {
        this.$nextTick(this.ensureActiveSuggestionIsVisible)
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>
#commandbar {
  background: #efefef;
  border: 0;
  border-top: 1px solid #e2e2e2;
  bottom: 0;
  box-shadow: none;
  color: #5a5a5a;
  font-size: 15px;
  height: 30px;
  padding: 0 0 0 10px;
  position: fixed;
  width: 100%;
  z-index: 2
}

#commandbar:focus {
  outline: none;
}

#commandbar-suggestions {
  position: fixed;
  width: 100%;
  z-index: 2;
  bottom: 30px;
  height: 224px;
  background: #e0e0e0;
  overflow: auto;
}

.suggestion {
  padding: 5px;
  color: #4e4e4e;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.suggestion.active {
  background: #c1c1c1;
}
</style>
