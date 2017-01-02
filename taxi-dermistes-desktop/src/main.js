'use strict'

const logger = require('tracer').colorConsole()
const path = require('path')
const parseArgs = require('minimist')

const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const globalShortcut = require('electron').globalShortcut

logger.trace('Node.js version:', process.version)
logger.trace('Electron version:', process.versions.electron)

let args = parseArgs(process.argv)
//logger.trace('args:', args)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_window

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    main_window = new BrowserWindow({width: 800, height: 600})
    // Here is how to hide the menu
    //main_window.setMenu(null)

    main_window.loadURL(path.join('file://', __dirname, 'resource/index.html'))

    if (args['debug']) { // cf. README
        main_window.openDevTools()
    }

    if (args['max']) { // cf. README
        main_window.maximize()
    }

    // shortcut devTools
    globalShortcut.register('ctrl+shift+d', () => {
        main_window.toggleDevTools()
    })

    // Emitted when the window is closed
    main_window.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        main_window = null
    })
})
