const {ipcRenderer} = require('electron')

// Mode changes
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

// Navigation events
ipcRenderer.on('scroll:top', pageScroll.goToPageTop)
ipcRenderer.on('scroll:bottom', pageScroll.goToPageBottom)
ipcRenderer.on('scroll:down:halfpage', pageScroll.scrollDownHalfPage)
ipcRenderer.on('scroll:up:halfpage', pageScroll.scrollUpHalfPage)
