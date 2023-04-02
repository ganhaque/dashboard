console.log("pog");
window.electronAPI.timewPog()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

