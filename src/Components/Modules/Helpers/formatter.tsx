
/* function formatTime(time: string): string { */
/*   const hours = parseInt(time.split(':')[0]); */
/*   const minutes = parseInt(time.split(':')[1]); */
/*   console.log(hours); */
/*   const formattedTime = `${hours}h ${minutes}m`; */
/*   return formattedTime; */
/* } */

export function formatTime(str: string): string {
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

// convert second into hour, minute
export function formatSecond(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}, ` : '';
  const minuteString = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';

  return `${hourString}${minuteString}`;
}

// for memory
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
