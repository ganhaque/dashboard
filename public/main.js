// https://medium.com/folkdevelopers/the-ultimate-guide-to-electron-with-react-8df8d73f4c97
// const { app, BrowserWindow } = require('electron')
const {
  app,
  BrowserWindow,
  // Menu,
  ipcMain,
  // dialog
} = require('electron')

const path = require('path');
const url = require('url');
// const fs = require("fs");
const { exec } = require('child_process');
const os = require('os');

// const si = require('systeminformation');

function createWindow () {
  // const windowOne = new BrowserWindow()
  // // load HTML file via url
  // windowOne.loadURL('https://www.electronjs.org/')
  // const windowTwo = new BrowserWindow()
  // // load HTML file locally
  // windowTwo.loadFile('index.html')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
  mainWindow.loadURL('http://localhost:3000');

  // mainWindow.loadFile('build/index.html');

  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
  // mainWindow.loadURL(isDev ? 'http://localhost:3000' : 'file://${__dirname}/../build/index.html');
  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, 'build', 'index.html'),
  //     protocol: 'file:',
  //     slashes: true,
  //   })
  // );
  // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  // mainWindow.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, 'build', 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

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

  // Expose the executeCommand function
  ipcMain.handle('execute-command', async (_, commandString) => {
    return new Promise((resolve, reject) => {
      exec(commandString, (err, stdout, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  });

  function getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    // return cpuUsage;
    // console.log(cpuUsage);
    return 100 - Math.floor((totalIdle / totalTick) * 100);
  }

  function getRamUsage() {
    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;

    return `${formatBytes(usedRam)} / ${formatBytes(totalRam)}`;
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ipcMain.handle('get-os-info', () => {
    const osInfo = {
      cpuUsage: getCpuUsage(),
      ramUsage: getRamUsage(),
    };
    // console.log(osInfo);

    return osInfo;
  });

  ipcMain.handle('get-cpu-usage', () => {
    // return getCpuUsage();
    return cpuUsage;
  });
  ipcMain.handle('get-ram-usage', () => {
    const ramObject = {
      totalRam: os.totalmem(),
      freeRam: os.freemem(),
    }
    return ramObject;
  });

  ipcMain.handle('get-uptime', () => {
    // console.log("network");
    // console.log(os.networkInterfaces());
    return os.uptime();
  });

  ipcMain.handle('get-network-info', () => {
    return os.networkInterfaces();
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








const puppeteer = require('puppeteer');

async function scrapeWebsite() {
  console.log("Scrape start");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target website
  await page.goto('http://appl101.lsu.edu/booklet2.nsf/Selector2?OpenForm');
  console.log("Navigated");

  // print all innetHTML of b elements
  const bElements = await page.$$eval('option', elements => elements.map(element => element.innerHTML));
  console.log(bElements);

  // Select the values in the <select> elements in the first frame
  // await page.select('select[name="SemesterDesc"]', 'Second Spring Module 2024'); // Example value, change it as needed
  await page.select('select[name="SemesterDesc"]', 'Fall 2023'); // Example value, change it as needed
  await page.select('select[name="Department"]', 'COMPUTER SCIENCE'); // Example value, change it as needed
  // await page.select('select[name="Department"]', 'ART'); // Example value, change it as needed

  // Click the "Display Courses" button in the first frame
  await page.click('input[type="submit"][value="Display Courses"]');
  console.log("Clicked Display Courses");

  // Wait for the new page to open
  const target = await browser.waitForTarget(target => target.opener() === page.target());
  const newPage = await target.page();

  // TODO: Sometimes, if there are no courses, no pre
  // only b
  // so handle that

  // Get the innerHTML of the nested <pre> element in the new page
  const nestedPreElement = await newPage.$eval('pre', element => element.innerHTML);
  console.log(nestedPreElement);

  await browser.close();
}

scrapeWebsite();

/**
Data structure
record = {
  SemesterYearDescArr: []

  SemesterRecord: {
    DepartmentNameArr: []
    DepartmentRecord: {
      'COMPUTER SCIENCE': {
        '1000-level': Course[],
        // more level
      },
      // more departments
    }
  }

}

interface Course {
  available: number // interpret (F) as 0
  enrollment: number
  courseNumber: number
  isLab: boolean
  sectionNumber: number
  title: string
  begin: string //TODO:how to interpret time from this
  end: string //TODO:
  room: number
  building: string
  instructor: string
  specialEnrollment: string // or boolean for the different types
}



Feat:
- UPDATE & Local Storage
  - store record in local or server
  - display last updated time
  - user can manually update via a button if 12/24h have passed





**/
