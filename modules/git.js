// Load the required modules
const { app, BrowserWindow } = require('electron')
const moment = require('moment')
const axios = require('axios')

// Set your GitHub username and access token
const USERNAME = 'your-github-username'
const ACCESS_TOKEN = 'your-github-access-token'

// Create a new Electron window
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load your HTML file that will display the contribution data
  mainWindow.loadFile('index.html')

  // When the window is closed, set mainWindow to null
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Fetch the contribution data from the GitHub API
function fetchContributions() {
  const url = `https://api.github.com/users/${USERNAME}/events`
  const headers = { 'Authorization': `token ${ACCESS_TOKEN}` }
  
  axios.get(url, { headers })
    .then(response => {
      // Parse the contribution data and extract the relevant information
      const contributions = {}
      response.data.forEach(event => {
        const date = moment(event.created_at).format('YYYY-MM-DD')
        if (event.type === 'PushEvent') {
          const count = event.payload.size
          if (contributions[date]) {
            contributions[date] += count
          } else {
            contributions[date] = count
          }
        }
      })

      // Send the contribution data to the Electron window
      mainWindow.webContents.send('contributions', contributions)
    })
    .catch(error => {
      console.error(error)
    })
}

// When the Electron app is ready, fetch the contribution data and create the window
app.on('ready', function () {
  fetchContributions()
  createWindow()
})

// Quit the app when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>GitHub Contributions</title>
//   <style>
//     /* Define the styles for the contribution squares */
//     .contribution {
//       width: 10px;
//       height: 10px;
//       margin: 1px;
//       display: inline-block;
//     }
//
//     .contribution.empty {
//       background-color: #eee;
//     }
//
//     .contribution.filled {
//       background-color: #3fb950;
//     }
//   </style>
// </head>
// <body>
//   <h1>My GitHub Contributions</h1>
//   
//   <div id="contributions"></div>
//
//   <script>
//     // Use ipcRenderer to receive the contribution data from the main process
//     const { ipcRenderer } = require('electron')
//     ipcRenderer.on
