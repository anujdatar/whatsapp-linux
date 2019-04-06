// Modules to control application life and create native browser window
const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const eStore = require('electron-store')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// new electron-store obj to store window config
const conf = new eStore()


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './src/images/logo.png'),
    title: "WhatsApp",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // set window bounds based on stored config
  if (typeof conf.get('windowBounds') !== 'undefined') {
    mainWindow.setBounds(conf.get('windowBounds'))
  }

  // conventional way of opning a link in a browserWindow
  mainWindow.loadURL('https://web.whatsapp.com',
  {userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.106 Safari/537.36'})
  
  // Emitted when the window is going to be closed
  mainWindow.on('close', function() {
    conf.set('windowBounds', mainWindow.getBounds())
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // delete component
    mainWindow = null
  })

  mainWindow.on('resize', function () {
    conf.set("windowBounds", mainWindow.getBounds())
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // clears service worker before close
  // makes new window register new service worker
  // otherwise you get the WhatsApp browser version error
  mainWindow.webContents.unregisterServiceWorker(() => {
    console.log('Goodbye!!')
  })

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// Limit/disable the creation of additional windows
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    event.preventDefault()

    shell.openExternal(navigationUrl)
  })
})
