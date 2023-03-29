// const { dialog } = require('electron').remote;
// const fs = require('fs');
// const func = async () => {
//   console.log("clicked");
//   const response = await window.versions.ping()
//   console.log(response) // prints out 'pong'
// }
//
// func()
//
//
//
// const button = document.getElementById('create-file-btn');
// console.log(button);
// button.addEventListener('click', function() {
//   console.log("clicked");
// });
// button.addEventListener('click', function() {
//   // Show a save dialog to select the file location and name
//   dialog.showSaveDialog({
//     filters: [
//       { name: 'Text Files', extensions: ['txt'] }
//     ]
//   }).then(result => {
//     // Create the file with the selected name and location
//     if (!result.canceled) {
//       const filePath = result.filePath;
//       fs.writeFile(filePath, 'hello world', (err) => {
//         if (err) throw err;
//         console.log('File created successfully!');
//       });
//     }
//   }).catch(err => {
//     console.log(err);
//   });
// });

// const information = document.getElementById('info');
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

