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

contextBridge.exposeInMainWorld('electronAPI', {
  // timewPog: () => {
  //   console.log('Calling timewPog...');
  //   return ipcRenderer.invoke('timew-pog');
  // },
  timewStartSession: (sessionName) => {
    console.log('starting session...');
    return ipcRenderer.invoke('timew-start-session', sessionName);
  },
  timewStop: () => {
    console.log('Calling timewStop...');
    return ipcRenderer.invoke('timew-stop');
  },
  timewTotal: () => {
    // console.log('Calling timewStop...');
    return ipcRenderer.invoke('timew-total-all-tags');
  },
  timewCurrentTime: () => {
    // console.log('Calling timewStop...');
    return ipcRenderer.invoke('timew-current-time');
  },
});

