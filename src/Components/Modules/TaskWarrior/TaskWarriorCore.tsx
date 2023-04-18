
// TODO:
// parse task export
// selective reload
// currently, the init run everytime the taskwarrior page (sidebar) is opened
// can be optimized by doing init in the main app.tsx?

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

import { useState, useEffect, useRef, useCallback } from 'react';
/* import ProgressBar from '../ProgresBar'; */
import './TaskWarrior.css';
import {
  BsPlus
} from 'react-icons/bs'
/* import formatTime from '../Helpers/formatter'; */
/* import { parseTasksForTag } from './Parser'; */
import * as parser from './Parser';
/* import * as helper from './Helper'; */
import * as render from './Render';
/* import TagRenderer from './Render'; */
/* import * as database from './Database'; */

/* const EMPTY_JSON = "[\n]\n"; */


function TaskWarrior() {
  const [tagNameArray, setTagNameArray] = useState<string[]>([""]);
  const [tagNameArrayInitialized, setTagNameArrayInitialized] = useState(false);

  const [focusedTagName, setFocusedTag] = useState<string>("");
  const [focusedProjectName, setFocusedProjectName] = useState<string>("");
  const [focusedTaskID, setFocusedTaskID] = useState<number>(0);

  const { tagRecord, updateTagRecord } = parser.useParseTasksForTag(focusedTagName);

  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen(false);
  }

  // initialization
  useEffect(() => {
    parser.parseTags()
      .then((tagNames: string[]) => {
        setTagNameArray(tagNames);
        setTagNameArrayInitialized(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function fetchTagRecords(tagNameArray: string[]) {
    for (const tagName of tagNameArray) {
      console.log("do", tagName);
      await updateTagRecord(tagName);
    }
  }

  // on change to tagNameArray (handle completed signal)
  useEffect(() => {
    if (tagNameArrayInitialized) {
      console.log(tagNameArray);
      setFocusedTag(tagNameArray[0])
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayInitialized]);


  const handleTagClick = (tag: string) => {
    /* console.log("handle is called for tag:", tag); */
    setFocusedTag(tag);
    setFocusedProjectName('');
  }

  const handleProjectClick = (project: string) => {
    /* console.log("handle is called for project:", project); */
    if (focusedProjectName === project) {
      setFocusedProjectName('');
    }
    else {
      setFocusedProjectName(project);
    }
  }

  function PopUp({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      setText(event.target.value);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter') {
        console.log('User input:', text);
        // reset text
        setText('');
        onClose();
        // exec command add task with current focused tag and proj
        // update tagRecord (and other dependent components on the page)
      }
      else if (event.key === 'Escape') {
        // reset text
        setText('');
        onClose();
      }
      // if u then dont reset text and call modify command instead of add for the next enter
    }

    return (
      <div className="popup-input-div" style={{
        display: isOpen ? 'block' : 'none',
      }}>
        <input className="popup-input-box" type="text" value={text} onChange={handleInputChange} onKeyDown={handleKeyDown} ref={inputRef} />
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    );
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'a') {
        console.log("pressed a");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const debugClick = () => {
    console.log("Debug");
    console.log("tagNameArray:");
    console.log(tagNameArray);
    console.log("tagRecord:");
    console.log(tagRecord);
    console.log("focusedTagName");
    console.log(focusedTagName);
    console.log("focusedProjectName");
    console.log(focusedProjectName);
    console.log("focusedTaskID");
    console.log(focusedTaskID);
  }

  const debugClick2 = () => {
    console.log("Debug2");
    setIsOpen(true);
  }

  return (
    <div className="flex-container" id="bigbox">
      <div className="flex-container column-flex-direction flex-no-grow" id="tag-project-column">
        <div className="flex-no-grow">
          <h2 className="header">
            Questlog
          </h2>
          <div className="hover-button" onClick={() => debugClick()}>
            Debug
          </div>
          <div className="hover-button" onClick={() => debugClick2()}>
            <BsPlus size="32" />
          </div>
        </div>
        <div className="item flex-no-grow">
          <h2 className="header">
            Tags
          </h2>
          {render.renderTags(tagRecord, focusedTagName, tagNameArray, handleTagClick)}
        </div>
        <div className="item">
          <h2 className="header">
            Projects
          </h2>
          {render.renderProjects(tagRecord, focusedTagName, focusedProjectName, handleProjectClick)}
          {/* <p> */}
          {/*   render projects here */}
          {/* </p> */}
        </div>
      </div>
      <div className="flex-container column-flex-direction" id="column-2">
        <div className="item justify-content-flex-start">
          {render.renderHeader(tagRecord, focusedTagName, focusedProjectName)}
          <PopUp isOpen={isOpen} onClose={handleClose} />
          {render.renderTasks(focusedTagName, focusedProjectName, tagRecord)}
        </div>
      </div>
    </div>
  );
}

export default TaskWarrior;
