const {ipcRenderer} = require('electron')

function registerListeners() {
  // Mode changes
  window.addEventListener('focus', function () {
    ipcRenderer.sendToHost('window:focus')
  })

  // Fix focus when iframe is the active element
  ipcRenderer.on('document:activeelement:blur', () => {
    if (document.activeElement) {
      document.activeElement.blur()
    }
  })

  document.addEventListener('hint:close', function () {
    ipcRenderer.sendToHost('hint:close')
  })

  document.addEventListener('hint:yank', function (ev) {
    ipcRenderer.sendToHost('hint:yank', ev.detail.url)
  })

  document.addEventListener('hint:focusinput', function () {
    ipcRenderer.sendToHost('hint:focusinput')
  })

  // Navigation
  ipcRenderer.on('scroll:top', pageScroll.goToPageTop)
  ipcRenderer.on('scroll:bottom', pageScroll.goToPageBottom)
  ipcRenderer.on('scroll:down:halfpage', pageScroll.scrollDownHalfPage)
  ipcRenderer.on('scroll:up:halfpage', pageScroll.scrollUpHalfPage)

  // Hints
  ipcRenderer.on('hints:show', () => linkHints.activateLinkHintsMode())
  ipcRenderer.on('hints:show-tab', linkHints.activateLinkHintsModeToOpenInNewTab)
  ipcRenderer.on('hints:show-yank', linkHints.activeLinkHinstModeYank)
  ipcRenderer.on('hints:hide', linkHints.deactivateLinkHintsMode)
}

document.onready = registerListeners
