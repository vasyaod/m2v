// Modules to control application life and create native browser window
import {app, BrowserWindow, Menu, Tray} from 'electron'
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
import path from 'path'
require('./api.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let serverProc
let isServerRunned = true
let tray = null

const createWindow = () => {
  if (!mainWindow) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        webSecurity: false,
        allowRunningInsecureContent: true
      },
//      icon: __dirname + '/icon/ic_launcher.png',
    })
    mainWindow.setMenu(null);
    mainWindow.maximize()
    mainWindow.show()
    console.log(path.join(__static, 'ui/index.html'))
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__static, 'ui/index.html'))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  } else {
    mainWindow.maximize()
    mainWindow.show()
  }
}

// const createTray = () => {
//   tray = new Tray(__dirname + '/icon/ic_launcher.png')
//   const contextMenu = Menu.buildFromTemplate([
//     {label: 'Console', type: 'normal', click: () => {mainWindow.toggleDevTools()}},
//   ])
//   tray.on('double-click', () => {
//     createWindow()
//   })
//   tray.on('click', () => {
//     createWindow()
//     //tray.popUpContextMenu()
//     //tray.popUpContextMenu([contextMenu])
//   })
//   tray.setToolTip('dsfsdafsdfsdf')
//   tray.setContextMenu(contextMenu)
// }

// const exit = () => {
//   isServerRunned = false
//   serverProc.kill()
//   app.quit()
//   //  process.exit(0)
// }

//const shouldQuit = app.makeSingleInstance(() => {
//  createWindow()
//});

// if (shouldQuit) {
//   app.quit();
//   return;
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
//  createTray()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.exit(0)
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.