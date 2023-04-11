// https://medium.com/folkdevelopers/the-ultimate-guide-to-electron-with-react-8df8d73f4c97
// const { app, BrowserWindow } = require('electron')
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path');
const fs = require("fs");
const { exec } = require('child_process');

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
  // win.webContents.openDevTools()
}


app.whenReady().then(() => {
  // ipcMain.on('counter-value', (_event, value) => {
  //   console.log(value) // will print value to Node console
  // })

  // ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow();

  // ipcMain.handle('create-file', (event, text) => {
  //   const filePath = 'sample.txt';
  //   fs.writeFile(filePath, text, (err) => {
  //     if (err) throw err;
  //     console.log('The file has been saved!');
  //   });
  // });

  // ipcMain.handle('timew-pog', async () => {
  //   return new Promise((resolve, reject) => {
  //     exec('timew start "pog"', (err, stdout, stderr) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(stdout);
  //     });
  //   });
  // });

  const timewCommands = {
    'timew-start-session': (sessionName) => `timew start "${sessionName}"`,
    'timew-stop': () => `timew stop`,
    'timew-total-today': () => `timew sum | tail -n 2`,
    'timew-current-time': () => `timew | tail -n 1`,
    'timew-current-tag': () => `timew | head -n 1`,
    'timew-tag-total-time': (sessionName) => `timew sum :all "${sessionName}" | tail -n 2 | head -n 1`,
  };

  // ipcMain.handle('timew', async (event, command, ...args) => {
  ipcMain.handle('timew', async (_, command, ...args) => {
    const cmd = timewCommands[command](...args);
    return new Promise((resolve, reject) => {
      // exec(cmd, (err, stdout, stderr) => {
      exec(cmd, (err, stdout, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  });

  const taskCommands = {
    // basic export
    'task-export': () => 'task export',
    // all pending tasks for a given tag
    'task-export-tag': (tag) => `task context none; task tags:"${tag}" '(status:pending or status:completed or status:waiting)' count`,
    // show all tags
    'task-all-tags': () => 'task tag | head -n -2 | tail -n +4 | cut -f1 -d" "',
    // get number of all tasks for project - complete and pending
    'task-count-total-tasks-for-project': (proj, tag) => `task context none; task project:"${proj}" tags:"${tag}" '(status:pending or status:completed or status:waiting)' count`,


    // execute_command
    'task-add': (proj, tag, desc) => `task add proj:"${proj}" tags:"${tag}" ${desc}`,
    'task-add': (id, desc) => `task ${id} annotate ${desc}`,
    'task-delete': (id) => `echo 'y' | task delete ${id}`,
    'task-done': (id) => `echo 'y' | task done ${id}`,
    'task-undo': () => `echo 'y' | task undo`,
  };

  ipcMain.handle('task', async (_, command, ...args) => {
    const cmd = timewCommands[command](...args);
    return new Promise((resolve, reject) => {
      // exec(cmd, (err, stdout, stderr) => {
      exec(cmd, (err, stdout, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
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




// exec("cd && ls -la", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

// Execute the "timew" command to get a report
// exec('timew start "pog"', (err, stdout, stderr) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//     return;
//   }
//
//   // Do something with the output
//   console.log(stdout);
// });

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
