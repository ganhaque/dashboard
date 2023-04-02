import React, { useState, useEffect } from 'react';

type Props = {
  timeInSeconds: number;
  onFinish: () => void;
};

const Timer: React.FC<Props> = ({ timeInSeconds, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(timeInSeconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish();
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onFinish]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // TODO: add a gif or something here for fun
  return (
    <div id="Timer">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
