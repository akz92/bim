<template>
    <div id="tabs">
      <span v-for="(tab, index) in tabs" class="tab" v-bind:class="{ active: index === activeIndex }" @click="setActiveIndex(index)">
        <i class="tab-favicon nav-icons" v-bind:class="{ loading: tab.loading }">
          <svg height="100%" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </i>

        <i class="tab-title">{{tab.title}}</i>

        <i class="tab-close nav-icons" @click.stop="closeTab(index)">
          <svg height="100%" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </i>
      </span>

      <i id="add" class="nav-icons" title="Add new tab" @click="addTab">
        <svg height="100%" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </i>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Tabs',
  computed: {
    ...mapState([
      'tabs',
      'activeIndex'
    ])
  },
  methods: {
    ...mapActions([
      'addTab',
      'closeTab',
      'setActiveIndex'
    ])
  }
}
</script>

<style scoped>
#tabs {
  align-items: center;
  background: rgba(211, 211, 211, 0.5);
  display: flex;
  font-family: arial;
  height: 32px;
  min-height: 32px;
  overflow-y: hidden !important;
  overflow: auto;
}

#add {
  fill: #000;
  height: 24px;
  margin: 4px;
  width: 24px;
}

.tab {
  align-items: center;
  display: flex;
  height: 38px;
  min-height: 20px;
  min-width: 60px;
  width: 180px;
}

.tab:not(:first-of-type) {
  border-left: 1px solid #dcdcdc;
}

.tab:last-of-type {
  border-right: 1px solid #dcdcdc;
}

.tab.active {
  background: rgba(195, 195, 195, 0.5);
}

.tab-favicon {
  align-content: flex-start;
  fill: #000;
  height: 24px;
  margin: 6px;
  width: 24px;
}

.tab-favicon.loading {
  animation: nav-spin 2s linear infinite;
}

.tab-title {
  color: #606060;
  cursor: default;
  flex: 1;
  font-size: 12px;
  font-style: normal;
  overflow: hidden;
  padding-left: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-title:hover {
  color: #000;
}

.tab-close {
  align-content: flex-end;
  fill: #000;
  height: 16px;
  margin: 0px;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s linear;
  visibility: hidden;
  width: 24px;
}

.tab:hover .tab-close {
  visibility: visible;
  opacity: 1;
}

.tab-close:hover {
  fill: #dc143c;
}

@keyframes nav-spin {
  0% {transform:rotate(0deg);}
  100% {transform:rotate(360deg);}
}
</style>
