const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

const date = new Date();
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });
const hourAndMinute = timeFormat.format(date);
console.log(`Sending time: ${hourAndMinute}`);
timeElement.textContent = hourAndMinute;


// const dateString = new Date().toDateString();
// const dateString = new Date().toDateString();
// const dateFormat = { month: 'long', year: 'numeric' };
const dateFormat = new Intl.DateTimeFormat('en-US', {
  // weekday: 'short',
  weekday: 'long',
  month: 'long',
  day: '2-digit',
  // year: 'numeric'
});
let dateString = dateFormat.format(date).replace(',', '');

console.log(`Sending date: ${dateString}`);
dateElement.textContent = dateString;

setInterval(() => {
  // const timeString = new Date().toLocaleTimeString();
  const timeString = new Date();
  const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });
  const hourAndMinute = timeFormat.format(timeString);
  console.log(`Sending time: ${hourAndMinute}`);
  timeElement.textContent = hourAndMinute;
  // window.api.updateTime(timeString);
}, 1000);;

