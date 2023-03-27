const timeElement = document.getElementById('time');

setInterval(() => {
  const timeString = new Date().toLocaleTimeString();
  console.log(`Sending time: ${timeString}`);
  timeElement.textContent = timeString;
  // window.api.updateTime(timeString);
}, 1000);;
