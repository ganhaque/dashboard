// TODO: have timer amount be an array or object and create that many buttons for timer
// TODO: style the button

import React, { useState } from 'react';
import Timer from './Timer';

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const handleTimerFinish = () => {
    setTimeLeft(null);
    // Play a sound or do anything else you want when the timer finishes
  };

  const handleButton1Click = () => {
    setTimeLeft(30);
  };

  const handleButton2Click = () => {
    setTimeLeft(60);
  };

  return (
    <div className="item flex-container column-flex-direction no-gap-flex" id="TimeKeeper">
      <h2 className="header">
        Timekeeper
      </h2>
      <div className="flex-container column-flex-direction" id="timer-button-container">
        {!timeLeft && (
          <>
            <div className="item button" id="timer-button" onClick={handleButton1Click}>Start (30 seconds)</div>
            <div className="item button" id="timer-button" onClick={handleButton2Click}>(60 seconds)</div>
            </>
        )}
        {timeLeft && <Timer timeInSeconds={timeLeft} onFinish={handleTimerFinish} />}
      </div>
    </div>
  );
};

export default App;

