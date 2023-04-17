import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });
      const hourAndMinute = timeFormat.format(now);
      setTime(hourAndMinute);

      const dateFormat = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: '2-digit'
      });
      let dateString = dateFormat.format(now).replace(',', '');
      setDate(dateString);

      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      /* console.log(midnight); */
      const remainingMilliseconds = midnight.getTime() - now.getTime();
      const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      if (remainingHours === 0) {
        setRemainingTime(`only ${remainingMinutes} minutes remaining...`);
      }
      else if (remainingHours === 1) {
        setRemainingTime(`${remainingHours} hour and ${remainingMinutes} minutes remaining...`);
      }
      else {
        setRemainingTime(`${remainingHours} hours and ${remainingMinutes} minutes remaining...`);
      }
    };

    updateTime();

    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className="item flex-shrink">
        <div id="time">{time}</div>
        <div id="date">{date}</div>
        <div id="remaining-time">{remainingTime}</div>
      </div>
    </>
  );
}

export default Clock;
