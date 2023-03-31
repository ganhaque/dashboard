// https://medium.com/folkdevelopers/the-ultimate-guide-to-electron-with-react-8df8d73f4c97
// const { app, BrowserWindow } = require('electron')
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path');
const fs = require("fs");

function createWindow () {
  // const windowOne = new BrowserWindow()
  // // load HTML file via url
  // windowOne.loadURL('https://www.electronjs.org/')
  // const windowTwo = new BrowserWindow()
  // // load HTML file locally
  // windowTwo.loadFile('index.html')

  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // minHeight:400,
    // minWidth:400,
    // prevent white flashes
    frame: false,
    backgroundColor: '#101317',
    // Don't show the window until it's ready, this prevents any white flickering
    // show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule:true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  //load the index.html from a url
  win.loadURL('http://localhost:3000');

  // Show window when page is ready to prevent white flashes
  // win.once('ready-to-show', () => {
  //   win.show()
  // })

  // Open the DevTools.
  win.webContents.openDevTools()
}


app.whenReady().then(() => {
  // ipcMain.on('counter-value', (_event, value) => {
  //   console.log(value) // will print value to Node console
  // })

  // ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow();

  ipcMain.handle('create-file', (event, text) => {
    const filePath = 'sample.txt';
    fs.writeFile(filePath, text, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)
//
// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
//
// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// Disable the getvsyncparametersifavailable() failed for 1 times
// https://github.com/electron/electron/issues/32760
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
