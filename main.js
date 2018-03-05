const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');
  const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

let mainWindow
let deeplinkingUrl

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768
  });

  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    titleBarStyle: 'hiddenInset',
    show: false
  })

  mainWindowState.manage(mainWindow);

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080')
    mainWindow.openDevTools()
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (deeplinkingUrl) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('add-tab', deeplinkingUrl)
    })
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('focus', function () {
    mainWindow.webContents.send('browser:focus')
  })

  if (isDev) {
    installExtension(VUEJS_DEVTOOLS).then(() => {
      mainWindow.addDevToolsExtension(VUEJS_DEVTOOLS)
    })
  }
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

// Force integrated graphics card
app.disableHardwareAcceleration();

if (!isDev) {
  const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()
    }
  })

  if (isSecondInstance) {
    app.quit()
  }
}

// function logEverywhere(s) {
//     console.log(s)
//     if (mainWindow && mainWindow.webContents) {
//         mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
//     }
// }
