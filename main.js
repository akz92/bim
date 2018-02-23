const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 1024, height: 768, titleBarStyle: 'hiddenInset' })

  mainWindow.loadURL('http://localhost:8080')
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'dist/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  mainWindow.openDevTools()
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

app.on('window-all-closed', function() {
  app.quit()
})

app.on('ready', createWindow)
app.on('ready', buildMenu)
app.disableHardwareAcceleration();
