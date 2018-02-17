const ElectronNavigation = require('electron-navigation')
const enav = new ElectronNavigation()
const views = document.querySelector('#nav-body-views')
const tabs = document.querySelector('#nav-body-tabs')
const controls = document.querySelector('#nav-body-ctrls')
const controlsUrl = document.querySelector('#nav-ctrls-url')


window.onresize = doLayout;

onload = function() {
  doLayout();
  addListeners();
}

function doLayout() {
  var controlsHeight = controls.offsetHeight;
  var tabsHeight = tabs.offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var viewsWidth = windowWidth;
  var viewsHeight = windowHeight - controlsHeight - tabsHeight;

  views.style.width = viewsWidth + 'px';
  views.style.height = viewsHeight + 'px';
}

function addListeners() {
  controlsUrl.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) { controlsUrl.blur(); }
    if (event.keyCode === 27) { controlsUrl.blur(); }
  });
}

// Shortcuts
const {remote} = require('electron');
const MouseTrap = require('mousetrap');
const mainWindow = remote.getCurrentWindow();
require('./node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js')

MouseTrap.bindGlobal('command+i', () => {
  mainWindow.openDevTools();
});

MouseTrap.bindGlobal('command+shift+i', () => {
  enav.openDevTools();
});

MouseTrap.bindGlobal('command+w', (e) => {
  controlsUrl.blur();
  enav.closeTab();
  e.preventDefault();
});

MouseTrap.bindGlobal('command+t', () => {
  controls.classList.remove('hidden');
  doLayout();
  enav.newTab('');
  controlsUrl.focus();
})

MouseTrap.bindGlobal('command+r', (e) => {
  e.preventDefault();
  enav.reload();
})

MouseTrap.bindGlobal('command+h', (e) => {
  controls.classList.toggle('hidden');
  doLayout();
  e.preventDefault();
});

// MouseTrap.bind('i', (e) => {
//   controls.classList.remove('hidden');
//   controlsUrl.focus();
//   e.preventDefault();
// });
