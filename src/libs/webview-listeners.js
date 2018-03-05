const {ipcRenderer} = require('electron')

window.addEventListener('focus', function () {
  ipcRenderer.sendToHost('window:focus')
})

window.addEventListener('blur', function () {
  ipcRenderer.sendToHost('window:blur')
})

document.addEventListener('hint:close', function () {
  ipcRenderer.sendToHost('hint:close')
})

document.addEventListener('hint:focusinput', function () {
  ipcRenderer.sendToHost('hint:focusinput')
})
