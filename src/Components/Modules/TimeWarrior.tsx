// TODO: better styling
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI: {
      timewStartSession?: (tag: string) => Promise<string>;
      timewStop?: () => Promise<string>;
      timewTotal?: () => Promise<string>;
      timewCurrentTime?: () => Promise<string>;
    };
  }
}

function TimeWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalTime, setTotalTime] = useState('');
  const [currentTime, setCurrentTime] = useState(''); // to store current time

  const tags = [
    'School',
    'Hobby',
    'Personal'
  ];

  const updateTotalTime = async () => {
    if (window.electronAPI?.timewTotal) {
      window.electronAPI.timewTotal()
        .then((output) => {
          const totalHours = parseInt(output.split(':')[0]);
          const totalMinutes = parseInt(output.split(':')[1]);
          const formattedTotalTime = `${totalHours}h ${totalMinutes}m`;
          setTotalTime(formattedTotalTime);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updateCurrentTime = async () => {
    if (window.electronAPI?.timewCurrentTime) {
      window.electronAPI.timewCurrentTime()
        .then((output) => {
          // IDEA: if the minutes reaches a certain threshold, then play a sound
          const minutes = parseInt(output.split(":")[1], 10);
          const formattedTime = `${minutes}m`;
          setCurrentTime(formattedTime);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };


  // check if there is already a session on startup
  // uncomment so that this does not run 100 something times per seconds
  useEffect(() => {
    if (window.electronAPI?.timewCurrentTime) {
      window.electronAPI.timewCurrentTime()
        .then((output) => {
          /* console.log(output); */
          // weird
          /* if (output === 'There is no active time tracking.') { */
          if (output.includes('There is no active time tracking.')) {
            /* console.log("no session"); */
            setIsSessionActive(false);
          }
          else {
            /* console.log("there is already a session") */
            setIsSessionActive(true);
            updateTotalTime();
            updateCurrentTime();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTotalTime();
      updateCurrentTime();
    }, 60000); // update every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleStartClick = (tag: string) => () => {
    if (window.electronAPI?.timewStartSession) {
      window.electronAPI.timewStartSession(tag)
        .then(() => {
          setIsSessionActive(true);

          updateTotalTime();
          updateCurrentTime();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleStopClick = () => {
    if (window.electronAPI?.timewStop) {
      window.electronAPI.timewStop()
        .then(() => {
          setIsSessionActive(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const renderSessionInfo = () => {
    if (isSessionActive) {
      return (
        <div className="flex-container column-flex-direction">
          <h2 className="smaller-header header">
            Current Sesison
          </h2>
          <p>
            {currentTime}
          </p>
          <div className="flex-container">
            <div>
              <h2 className="smaller-header header">
                Working on
              </h2>
            </div>
            <div className="flex-container column-flex-direction">
              <div>
                <h2 className="smaller-header header">
                  Total Today
                </h2>
                <p>
                  {totalTime}
                </p>
              </div>
            </div>
          </div>
          <div className="item button" id="stop-button" onClick={handleStopClick}>
            Stop
          </div>
        </div>
      );
    }

    return (
      <>
        <p>
          Start a new session
        </p>
        {tags.map((tag) => (
          <div key={tag} className="item button" onClick={handleStartClick(tag)}>
            {`${tag}`}
          </div>
        ))}
        </>
    );
  };

  return (

    <div className="item flex-container column-flex-direction no-gap-flex" id="TimeKeeper">
      <h2 className="header">
        Timewarrior
      </h2>
      <div className="flex-container column-flex-direction" id="timer-button-container">
        {renderSessionInfo()}
      </div>
    </div>
  );
}

export default TimeWarrior;
