const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path');
const fs = require("fs");

// async function handleFileOpen() {
//   const { canceled, filePaths } = await dialog.showOpenDialog()
//   if (canceled) {
//     return
//   }
//   else {
//     return filePaths[0]
//   }
// }

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // prevent white flashes
    backgroundColor: '#101317',
    autoHideMenuBar: true,
    // nodeIntegration: true,
    // contextIsolation: false,
    // enableRemoteModule: true,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      // enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Don't show the window until it's ready, this prevents any white flickering
    show: false,
  });

  // const menu = Menu.buildFromTemplate([{
  //   label: app.name,
  //   submenu: [
  //     {
  //       click: () => mainWindow.webContents.send('update-counter', 1),
  //       label: 'Increment',
  //     },
  //     {
  //       click: () => mainWindow.webContents.send('update-counter', -1),
  //       label: 'Decrement',
  //     }
  //   ]
  // }])

  // Menu.setApplicationMenu(menu)

  // ipcMain.on('set-title', (event, title) => {
  //   const webContents = event.sender
  //   const mainWindow = BrowserWindow.fromWebContents(webContents)
  //   mainWindow.setTitle(title)
  // })

  // ipcMain.handle('ping', () => 'pong')
  mainWindow.loadFile('index.html');

  // Show window when page is ready to prevent white flashes
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
};

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

// Disable the getvsyncparametersifavailable() failed for 1 times
// https://github.com/electron/electron/issues/32760
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

