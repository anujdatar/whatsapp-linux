const { app, BrowserView, BrowserWindow, shell} = require('electron')
const electronStore = require('electron-store')
const fs = require('fs')
const path = require('path')

// external js script file
const unregisterWorker = fs.readFileSync(
  path.join(__dirname, 'unregisterWorker.js'),
  'utf8'
)

// const defaults = require('./defaults')

// keep main window global, to avoid accidental garbage collection
let mainWindow

// define new electron store
const configStore = new electronStore()

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '../images/logo.png'),
    title: 'WhatsApp',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, './preload.js')
    }
  })

  if (typeof configStore.get('windowBounds') !== 'undefined') {
    mainWindow.setBounds(configStore.get('windowBounds'))
  }

  // conventional way of opning a link in a browserWindow
  // mainWindow.loadFile(path.join(__dirname, '../html/index.html'))
  mainWindow.loadURL('https://web.whatsapp.com',
  {userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.106 Safari/537.36'})
  
  mainWindow.webContents.openDevTools()

  // Emitted when the window is going to be closed
  mainWindow.on('close', function() {
    configStore.set('windowBounds', mainWindow.getBounds())
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // delete component
    mainWindow = null
  })

  mainWindow.on('resize', function () {
    configStore.set("windowBounds", mainWindow.getBounds())
  })
}

// Electron initialized and ready to create browser window.
app.on('ready', function() {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // clears service worker before close
  // makes new window register new service worker
  // to avoid WhatsApp browser version error
  mainWindow.webContents.executeJavaScript(unregisterWorker)
  // ########### deprecated, to be removed soon ##############
  // mainWindow.webContents.unregisterServiceWorker(() => {
  //   console.log('Goodbye!!')
  // })
  // ########################################################

  // MacOS app quit event handling
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // MacOS re-create a window when dock icon is clicked
  // and there are no other windows open
  if (mainWindow === null) createWindow()
})

// Limit/disable the creation of additional electron windows
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    // open this event's url in the system default browser.
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
