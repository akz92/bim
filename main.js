const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let deeplinkingUrl

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768, titleBarStyle: 'hiddenInset', show: false })

  mainWindow.loadURL('http://localhost:8080')
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'dist/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  mainWindow.openDevTools()

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (deeplinkingUrl) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('add-tab', deeplinkingUrl)
    })
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function buildMenu() {
  var template = [{
    label: "Application",
    submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', createWindow)
app.on('ready', buildMenu)

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
