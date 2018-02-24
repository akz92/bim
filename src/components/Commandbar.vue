<template>
  <input id="statusbar" class="active" ref="statusbar" v-model="text" @keyup.enter.exact="submit" @keyup.enter="$event.target.blur()"/>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import commandParser from '../utils/command-parser'

export default {
  name: 'Commandbar',
  data: function () {
    return {
      text: null
    }
  },
  computed: {
    ...mapState(['activeIndex'])
  },
  methods: {
    commandParser,
    ...mapActions([
      'addTab',
      'setUrl',
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
            if (command.flag === 't') {
              this.addTab({ url: command.argument })
            } else {
              this.setUrl({ url: command.argument, index: this.activeIndex })
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
        }
      }

      this.text = null
    }
  }
}
</script>

<style scoped>
#statusbar {
  background: #efefef;
  border: 0;
  border-top: 1px solid #e2e2e2;
  bottom: 0;
  box-shadow: none;
  color: #5a5a5a;
  font-size: 16px;
  height: 30px;
  padding: 0 0 0 5px;
  position: fixed;
  width: 100%;
  display: none;
}

#statusbar:focus {
  outline: none;
}

#statusbar.active {
  display: inline;
}
</style>
