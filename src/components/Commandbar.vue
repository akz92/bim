<template>
  <input
    id="commandbar"
    ref="commandbar"
    v-model="text"
    v-if="active"
    v-focus
    @blur="setCommandbarActive(false)"
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
  computed: {
    ...mapState({
      activeIndex: 'activeIndex',
      active: 'commandbarActive'
    }),
    ...mapGetters(['url'])
  },
  methods: {
    commandParser,
    ...mapActions([
      'setCommandbarActive',
      'addTab',
      'setWebviewUrl',
      'closeTab',
      'setActiveIndex',
      'setGoBack',
      'setGoForward',
      'setReload',
      'setStop',
      'setInspect'
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
              this.setWebviewUrl({ url: command.argument, index: this.activeIndex })
            }
            break;
          case 'tab-close':
            this.closeTab(parseInt(this.index) || this.activeIndex)
            break;
          case 'tab-focus':
            if (typeof command.argument === 'string') {
              this.setActiveIndex(command.argument)
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
        }
      }

      blur()
    },
    blur: function () {
      this.text = null
      this.$refs.commandbar.blur()
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
}

#commandbar:focus {
  outline: none;
}
</style>
