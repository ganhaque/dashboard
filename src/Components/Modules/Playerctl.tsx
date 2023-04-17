import { useState, useEffect } from 'react';
import {
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayArrow,
  MdPause,
} from 'react-icons/md';

function Playerctl() {
  const [currentSongInfo, setCurrentSongInfo] = useState<string>("");

  function handlePreviousClick() {
    const cmd = `playerctl previous -i firefox`;
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(cmd)
    }
  }

  function handlePlayPauseClick() {
    const cmd = `playerctl play-pause -i firefox`;
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(cmd)
    }
  }

  function handleNextClick() {
    const cmd = `playerctl next -i firefox`;
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(cmd)
    }
  }

  const fetchCurrentSongInfo = () => {
    const cmd = `playerctl -a metadata --format '{\"text\": \"{{duration(position)}} / {{duration(mpris:length)}} : {{markup_escape(title)}} - {{artist}}\", \"tooltip\": \"{{playerName}} : {{markup_escape(title)}}\", \"alt\": \"{{status}}\", \"class\": \"{{status}}\"}' -i firefox -F`;
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(cmd)
        .then((output) => {
          console.log(output);
          setCurrentSongInfo(output);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // initialization
  useEffect(() => {
    console.log("init");
    fetchCurrentSongInfo();
  }, []);


  return (
    <div className="item flex-no-grow">
      <div className="flex-container">
        <div className="hover-button" onClick={() => handlePreviousClick()}>
          <MdSkipPrevious size="16" />
        </div>
        <div className="hover-button" onClick={() => handlePlayPauseClick()}>
          <MdPause size="16" />
          <MdOutlinePlayArrow size="16" />
          {currentSongInfo}
        </div>
        <div className="hover-button" onClick={() => handleNextClick()}>
          <MdSkipNext size="16" />
        </div>
      </div>
    </div>
  );
}

export default Playerctl;
