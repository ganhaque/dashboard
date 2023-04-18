export function format_due_date(due: string): string {
  // taskwarrior returns due date as string
  // convert that to a JavaScript timestamp
  const pattern = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
  const [xyear, xmon, xday, xhr, xmin, xsec] = pattern.exec(due)!;
  const ts = new Date(
    Date.UTC(Number(xyear), Number(xmon) - 1, Number(xday), Number(xhr), Number(xmin), Number(xsec))
  ).getTime();

  // turn timestamp into human-readable format
  const now = Date.now();
  console.log(ts);
  console.log(now);
  const time_difference = ts - now;
  console.log("time diff", time_difference);
  const abs_time_difference = Math.abs(time_difference);
  const days_rem = Math.floor(abs_time_difference / 86400000);
  const hours_rem = Math.floor(abs_time_difference / 3600000);

  // due date formatting
  let due_date_text: string;
  if (days_rem >= 1) {
    // in x days / x days ago
    due_date_text = `${days_rem} day${days_rem > 1 ? "s" : ""}`;
  } else {
    // in x hours / in <1 hour / etc
    if (hours_rem === 1) {
      due_date_text = `${hours_rem} hour`;
    } else if (hours_rem < 1) {
      due_date_text = "<1 hour";
    } else {
      due_date_text = `${hours_rem} hours`;
    }
  }

  if (time_difference < 0) {
    // overdue
    due_date_text += " ago";
  } else {
    due_date_text = `in ${due_date_text}`;
  }

  return due_date_text;
}

/* YYYYMMDDTHHMMSSZ */
export function formatDueDate(due: string): string {
  const [, year, month, day, hour, minute, second] = due.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/) || [];

  if (!year || !month || !day || !hour || !minute || !second) {
    throw new Error('Invalid date format');
  }

  const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  const now = Date.now();
  const timeDifference = timestamp - now;
  const absTimeDifference = Math.abs(timeDifference);
  const daysRem = Math.floor(absTimeDifference / 86400000);
  const hoursRem = Math.floor(absTimeDifference / 3600000);
  const hoursRemDay = hoursRem % 24;

  let dueDateText: string;
  if (daysRem >= 1) {
    dueDateText = `${daysRem} day${daysRem > 1 ? 's' : ''}`;
    if (daysRem <= 3) {
      dueDateText += ` & ${hoursRemDay} hr`;
    }
  }
  else {
    if (hoursRem === 1) {
      dueDateText = '1 hour';
    }
    else if (hoursRem < 1) {
      dueDateText = '<1 hour';
    }
    else {
      dueDateText = `${hoursRem} hours`;
    }
  }

  if (timeDifference < 0) {
    dueDateText += ' ago';
  }
  else {
    dueDateText = `in ${dueDateText}`;
  }

  return dueDateText;
}
