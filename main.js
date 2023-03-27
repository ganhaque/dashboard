const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    nodeIntegration: true,
    // contextIsolation: false,
    enableRemoteModule: true,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      // enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // ipcMain.handle('ping', () => 'pong')
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

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

