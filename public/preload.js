const { contextBridge, ipcRenderer } = require('electron')
// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   // ping: () => ipcRenderer.invoke('ping'),
// });

// contextBridge.exposeInMainWorld('electronAPI', {
// setTitle: (title) => ipcRenderer.send('set-title', title),
// openFile: () => ipcRenderer.invoke('dialog:openFile'),
// handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
// createFile: (text) => ipcRenderer.invoke('create-file', text),
// timewPog: () => ipcRenderer.invoke('timew-pog'),
// })

window.api = {
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (commandString) => {
    return window.api.invoke('execute-command', commandString);
  },
});

