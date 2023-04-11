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

// contextBridge.exposeInMainWorld('electronAPI', {
//   // timewPog: () => {
//   //   console.log('Calling timewPog...');
//   //   return ipcRenderer.invoke('timew-pog');
//   // },
//   timewStartSession: (sessionName) => {
//     console.log('starting session with tag', sessionName);
//     return ipcRenderer.invoke('timew-start-session', sessionName);
//   },
//   timewStop: () => {
//     console.log('Calling timewStop...');
//     return ipcRenderer.invoke('timew-stop');
//   },
//   timewTotalToday: () => {
//     // console.log('Calling timewTotal...');
//     return ipcRenderer.invoke('timew-total-today');
//   },
//   timewCurrentTime: () => {
//     // console.log('Calling timewCurrentTime...');
//     return ipcRenderer.invoke('timew-current-time');
//   },
//   timewCurrentTag: () => {
//     // console.log('Calling timewCurrentTag...');
//     return ipcRenderer.invoke('timew-current-tag');
//   },
//   timewTagTotal: (tag) => {
//     // console.log('retrieving session with tag', tag);
//     return ipcRenderer.invoke('timew-tag-total-time', tag);
//   },
// });
//


window.api = {
  timew: (command, ...args) => {
    return window.api.invoke('timew', command, ...args);
  },
  task: (command, ...args) => {
    return window.api.invoke('task', command, ...args);
  },
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('electronAPI', {
  timewStartSession: (sessionName) => {
    console.log('starting session with tag', sessionName);
    return window.api.timew('timew-start-session', sessionName);
  },
  timewStop: () => {
    console.log('Calling timewStop...');
    return window.api.timew('timew-stop');
  },
  timewTotalToday: () => {
    // console.log('Calling timewTotal...');
    return window.api.timew('timew-total-today');
  },
  timewCurrentTime: () => {
    // console.log('Calling timewCurrentTime...');
    return window.api.timew('timew-current-time');
  },
  timewCurrentTag: () => {
    // console.log('Calling timewCurrentTag...');
    return window.api.timew('timew-current-tag');
  },
  timewTagTotal: (tag) => {
    // console.log('retrieving session with tag', tag);
    return window.api.timew('timew-tag-total-time', tag);
  },

  taskAllTags: () => {
    // console.log('retrieving session with tag', tag);
    return window.api.task('task-all-tags');
  },

});
