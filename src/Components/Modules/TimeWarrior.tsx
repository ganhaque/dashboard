import { useState, useEffect } from 'react';
import { formatTime } from './Helpers/formatter';

/* const timewCommands = { */
/*   'timew-start-session': (sessionName) => `timew start "${sessionName}"`, */
/*   'timew-stop': () => `timew stop`, */
/*   'timew-total-today': () => `timew sum | tail -n 2`, */
/*   'timew-current-time': () => `timew | tail -n 1`, */
/*   'timew-current-tag': () => `timew | head -n 1`, */
/*   'timew-tag-total-time': (sessionName) => `timew sum :all "${sessionName}" | tail -n 2 | head -n 1`, */
/* }; */

function TimeWarrior() {
  /* const isElectronAPIAvailable = useElectronAPI(); */
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalTimeToday, setTotalTimeToday] = useState('');
  const [currentSessionDuration, setCurrentSessionDuration] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  const tags = [
    'Hobby',
    'School',
    'Work'
  ];

  const updateTotalTimeTodayToday = async () => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew sum | tail -n 2`)
        .then((output) => {
          setTotalTimeToday(formatTime(output));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updateCurrentSessionDuration = async () => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew | tail -n 1`)
        .then((output) => {
          // IDEA: if the minutes reaches a certain threshold, then play a sound
          setCurrentSessionDuration(formatTime(output));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updateCurrentTag = async () => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew | head -n 1`)
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
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew | tail -n 1`)
        .then((output) => {
          // weird
          /* if (output === 'There is no active time tracking.') { */
          if (output.includes('There is no active time tracking.')) {
            /* console.log("no session"); */
            setIsSessionActive(false);
          }
          else {
            /* console.log("there is already a session") */
            setIsSessionActive(true);
            updateTotalTimeTodayToday();
            updateCurrentSessionDuration();
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
      updateTotalTimeTodayToday();
      updateCurrentSessionDuration();
      /* updateCurrentTag(); */
    }, 60000); // update every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleStartClick = (tag: string) => () => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew start ${tag}`)
        .then(() => {
          setIsSessionActive(true);
          updateTotalTimeTodayToday();
          updateCurrentSessionDuration();
          updateCurrentTag();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleStopClick = () => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(`timew stop`)
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
              {currentSessionDuration}
            </p>
          </div>
          <div className="flex-container" id="duo-div">
            <div className="flex-container column-flex-direction flex-no-gap">
              <h3 className="smaller-header header">
                Working on
              </h3>
              <p>
                {currentTag}
              </p>
            </div>
            <div className="flex-container column-flex-direction flex-no-gap">
              <h3 className="smaller-header header">
                Total Today
              </h3>
              <p>
                {totalTimeToday}
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

    <div className="item" id="">
      <h2 className="header">
        Timewarrior
      </h2>
      {renderSessionInfo()}
    </div>
  );
}

export default TimeWarrior;
