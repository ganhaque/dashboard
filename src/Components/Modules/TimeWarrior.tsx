// TODO: add current_tag
// TODO: better styling
import { useState, useEffect } from 'react';
/* import './TimeWarrior.css'; */
import formatTime from '../Helpers/formatter';

declare global {
  interface Window {
    electronAPI: {
      timewStartSession?: (tag: string) => Promise<string>;
      timewStop?: () => Promise<string>;
      timewTotal?: () => Promise<string>;
      timewCurrentTag?: () => Promise<string>;
      timewCurrentTime?: () => Promise<string>;
    };
  }
}

function TimeWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalTime, setTotalTime] = useState('');
  const [currentTime, setCurrentTime] = useState(''); // to store current time
  const [curretTag, setCurrentTag] = useState(''); // to store current tag

  const tags = [
    'School',
    'Hobby',
    'Personal'
  ];

  const updateTotalTime = async () => {
    if (window.electronAPI?.timewTotal) {
      window.electronAPI.timewTotal()
        .then((output) => {
          /* const totalHours = parseInt(output.split(':')[0]); */
          /* const totalMinutes = parseInt(output.split(':')[1]); */
          /* const formattedTotalTime = `${totalHours}h ${totalMinutes}m`; */
          setTotalTime(formatTime(output));
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
          /* const minutes = parseInt(output.split(":")[1], 10); */
          /* const formattedTime = `${minutes}m`; */
          setCurrentTime(formatTime(output));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updateCurrentTag = async () => {
    if (window.electronAPI?.timewCurrentTag) {
      window.electronAPI.timewCurrentTag()
        .then((output) => {
          const parts = output.split(" ");
          const task = parts[1];
          setCurrentTag(task);
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
            updateCurrentTag();
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
      /* updateCurrentTag(); */
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
          updateCurrentTag();
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
        <div className="flex-container column-flex-direction align-item-center flex-no-grow">
          <div>
            <h3 className="smaller-header header">
              Current Sesison
            </h3>
            <p id="current-session-time">
              {currentTime}
            </p>
          </div>
          <div className="flex-container" id="duo-div">
            <div className="flex-container column-flex-direction flex-no-gap">
              <h3 className="smaller-header header">
                Working on
              </h3>
              <p>
                {curretTag}
              </p>
            </div>
            <div className="flex-container column-flex-direction flex-no-gap">
              <h3 className="smaller-header header">
                Total Today
              </h3>
              <p>
                {totalTime}
              </p>
            </div>
          </div>
          <div className="item button" id="stop-button" onClick={handleStopClick}>
            Stop
          </div>
        </div>
      );
    }

    return (
      <div className="flex-container column-flex-direction flex-no-grow align-item-center">
        <p>
          Start a new session
        </p>
        {tags.map((tag) => (
          <div key={tag} className="item button" id="session-button" onClick={handleStartClick(tag)}>
            {`${tag}`}
          </div>
        ))}
      </div>
    );
  };

  return (

    <div className="item" id="TimeKeeper">
      <h2 className="header">
        Timewarrior
      </h2>
      {renderSessionInfo()}
    </div>
  );
}

export default TimeWarrior;
