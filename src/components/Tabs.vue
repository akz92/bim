<template>
  <div id="tabs" v-bind:class="{ 'with-navbar': navbarActive }">
      <span v-for="(tab, index) in tabs" class="tab" v-bind:class="{ active: index === activeIndex, loading: tab.loading }" @click="setActiveIndex(index)" >
        <!-- <i class="tab&#45;favicon nav&#45;icons"> -->
        <!--   <svg height="100%" viewBox="0 0 24 24"> -->
        <!--     <path d="M0 0h24v24H0z" fill="none"/> -->
        <!--     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10&#45;4.48 10&#45;10S17.52 2 12 2zm&#45;1 17.93c&#45;3.95&#45;.49&#45;7&#45;3.85&#45;7&#45;7.93 0&#45;.62.08&#45;1.21.21&#45;1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9&#45;2.54c&#45;.26&#45;.81&#45;1&#45;1.39&#45;1.9&#45;1.39h&#45;1v&#45;3c0&#45;.55&#45;.45&#45;1&#45;1&#45;1H8v&#45;2h2c.55 0 1&#45;.45 1&#45;1V7h2c1.1 0 2&#45;.9 2&#45;2v&#45;.41c2.93 1.19 5 4.06 5 7.41 0 2.08&#45;.8 3.97&#45;2.1 5.39z"/> -->
        <!--   </svg> -->
        <!-- </i> -->

        <div class="spinner"></div>

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

      <div class="mode" v-bind:class="{ normal: mode === 'normal', insert: mode === 'insert', hint: mode === 'hint' }">
        <p>{{mode}}</p>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Tabs',
  computed: {
    ...mapState(['mode', 'tabs', 'activeIndex', 'navbarActive'])
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
  border-bottom: 1px solid #e2e2e2;
  box-sizing: border-box;
  display: flex;
  font-family: arial;
  height: 38px;
  min-height: 32px;
  overflow-y: hidden !important;
  overflow: auto;
  padding: 0 100px 0 80px;
  position: relative;
  z-index: 10;
}

#tabs.with-navbar {
  border: 0;
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
  position: relative;
}

.tab:not(:first-of-type) {
  border-left: 1px solid #c1c1c1;
}

.tab:last-of-type {
  border-right: 1px solid #c1c1c1;
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

.tab-title {
  color: #606060;
  cursor: default;
  flex: 1;
  font-size: 12px;
  font-style: normal;
  overflow: hidden;
  padding-left: 5px;
  pointer-events: none;
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;
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

.mode {
  align-items: center;
  color: #efefef;
  display: flex;
  font-size: 12px;
  height: 100%;
  line-height: 100%;
  pointer-events: none;
  position: absolute;
  right: 0;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
  width: 70px;
}

.mode p {
  text-align: center;
  width: 100%;
}

.mode.normal {
  background: #34b4ff;
}

.mode.insert {
  background: #53c555;
}

.mode.hint {
  background: #fad62f;
}

@keyframes nav-spin {
  0% {transform:rotate(0deg);}
  100% {transform:rotate(360deg);}
}

.spinner {
  align-content: flex-start;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  border: 2px solid #969590;
  border-top-color: #D2D2C9;
  animation: spin 1s infinite linear;
  visibility: hidden;
  margin-left: 6px;
}

.tab.loading .spinner {
  visibility: visible;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
