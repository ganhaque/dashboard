fetch('https://wttr.in/?format=1')
  .then(response => response.text())
  .then(data => {
    document.getElementById('weather').textContent = data;
  })
  .catch(error => {
    console.error(error);
  });

// update every hour
setInterval(() => {
  fetch('https://wttr.in/?format=1')
    .then(response => response.text())
    .then(data => {
      document.getElementById('weather').textContent = data;
    })
    .catch(error => {
      console.error(error);
    });
}, 360000);;

