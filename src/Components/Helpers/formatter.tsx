
/* function formatTime(time: string): string { */
/*   const hours = parseInt(time.split(':')[0]); */
/*   const minutes = parseInt(time.split(':')[1]); */
/*   console.log(hours); */
/*   const formattedTime = `${hours}h ${minutes}m`; */
/*   return formattedTime; */
/* } */

function formatTime(str: string): string {
  // remove whitespace and seconds
  str = str.replace(/[\sa-zA-Z\n\r]/g, "");
  str = str.replace(/:\d+$/, "");

  const min_str = str.replace(/^\d+:/, "");
  const hour_str = str.replace(/:\d+$/, "");
  const min = parseInt(min_str, 10) || 0;
  const hour = parseInt(hour_str, 10);

  let txt = "--";
  const valid_hour = hour && hour > 0;
  if (min_str) txt = `${min}m`;
  if (valid_hour) txt = `${hour}h ${txt}`;

  return txt;
}

export default formatTime;
