<template>
  <input
    id="commandbar"
    ref="commandbar"
    v-model="text"
    v-if="active"
    v-focus
    @blur="blur"
    @keyup.enter.exact="submit"
    @keyup.enter="blur"
    @keyup.escape="blur"
  />
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import commandParser from '../utils/command-parser'

export default {
  name: 'Commandbar',
  data: function () {
    return {
      text: null
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
    this.$bus.$on('commandbar:inspect', this.setInspect)
  },
  computed: {
    ...mapState({
      activeIndex: 'activeIndex',
      active: 'commandbarActive'
    }),
    ...mapGetters(['url'])
  },
  methods: {
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
    setInspect: function (ev) {
      ev.preventDefault()

      this.text = ':inspect'
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
      'setHintMode'
    ]),
    submit: function () {
      var command = this.commandParser(this.text)

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
            this.setInspect(true)
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
            this.setHintMode(true)
            break;
        }
      }

      this.blur()
    },
    blur: function () {
      this.text = null

      if (this.$refs.commandbar) {
        this.$refs.commandbar.blur()
        this.setCommandbarActive(false)
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
</style>
