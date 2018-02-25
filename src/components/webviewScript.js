const {ipcRenderer} = require('electron')

window.addEventListener('focus', function () {
  ipcRenderer.sendToHost('focus')
})

window.addEventListener('blur', function () {
  ipcRenderer.sendToHost('blur')
})
