const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let deeplinkingUrl

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768, titleBarStyle: 'hiddenInset' })

  // mainWindow.loadURL('http://localhost:8080')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.openDevTools()

  if (deeplinkingUrl) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('add-tab', deeplinkingUrl)
    })
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('open-url', function (event, url) {
  event.preventDefault()
  deeplinkingUrl = url
  if (mainWindow) {
    mainWindow.webContents.send('add-tab', deeplinkingUrl)
  }
})

app.disableHardwareAcceleration();

// function logEverywhere(s) {
//     console.log(s)
//     if (mainWindow && mainWindow.webContents) {
//         mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
//     }
// }
