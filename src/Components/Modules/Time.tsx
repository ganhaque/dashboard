import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

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
      <div className="item">
        <div id="time">{time}</div>
        <div id="date">{date}</div>
      </div>
      </>
  );
}

export default Clock;
