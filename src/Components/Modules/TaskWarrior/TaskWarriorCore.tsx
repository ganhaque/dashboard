// TODO:
// parse task export
// selective reload
// currently, the init run everytime the taskwarrior page (sidebar) is opened
// can be optimized by doing init in the main app.tsx?

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

import { useState, useEffect, useCallback } from 'react';
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
import * as database from './Database';
import Prompt from './Prompt';


interface PromptHandlerMap {
  [prompt: string]: (inputText: string) => void;
}

function TaskWarrior() {
  const [tagNameArray, setTagNameArray] = useState<string[]>([""]);
  const [tagNameArrayInitialized, setTagNameArrayInitialized] = useState(false);
  const [tagNameArrayUpdated, setTagNameArrayUpdated] = useState(false);

  const [focusedTagName, setFocusedTag] = useState<string>("");
  const [focusedProjectName, setFocusedProjectName] = useState<string>("");
  const [focusedTaskID, setFocusedTaskID] = useState<number>(-1);

  const { tagRecord, updateTagRecord, resetTagRecord } = parser.useParseTasksForTag('');

  const [currentPrompt, setCurrentPrompt] = useState('');

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
      /* console.log("processing tagName:", tagName); */
      await updateTagRecord(tagName);
    }
  }

  // on change to tagNameArray (handle completed signal)
  useEffect(() => {
    if (tagNameArrayInitialized) {
      /* console.log(tagNameArray); */
      setFocusedTag(tagNameArray[0])
      setFocusedProjectName('');
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayInitialized]);
  useEffect(() => {
    if (tagNameArrayUpdated) {
      /* console.log(tagNameArray); */
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayUpdated]);


  const handleTagClick = (tag: string) => {
    setFocusedTag(tag);
    setFocusedProjectName('');
    setFocusedTaskID(-1);
  }
  const handleProjectClick = (project: string) => {
    if (focusedProjectName === project) {
      setFocusedProjectName('');
    }
    else {
      setFocusedProjectName(project);
    }
    setFocusedTaskID(-1);
  }
  const handleTaskClick = (taskID: number) => {
    setFocusedTaskID(taskID);
  }

  function addTaskSubmitHandler(userInput: string) {
    // how to format your input:
    // t:something p:"complex project" long long desc
    // p: can take "" or '' to have space between your words
    // t: does not do that since the parse for tagName only take single word tag

    // this is not optimized if not adding new tag or project
    // but making it work for those 3 different cases is not worth it lol
    const parsed = parser.parseUserInput(userInput, focusedTagName, focusedProjectName);

    let taskID: number = -1;
    database.addTask(parsed.tag, parsed.project, parsed.description, parsed.due)
      .then((result) => {
        taskID = result;
        reloadTagRecord();

        setFocusedTag(parsed.tag);
        setFocusedProjectName(parsed.project);
        console.log(taskID);
        setFocusedTaskID(taskID);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const modifyTaskHandler = (userInput: string) => {
    const parsed = parser.parseUserInput(userInput, focusedTagName, focusedProjectName);
    database.modifyTask(focusedTaskID, parsed.tag, parsed.project, parsed.description, parsed.due)
    reloadTagRecord();
  }

  const reloadTagRecord = () => {
    resetTagRecord();
    setTagNameArrayUpdated(false);
    parser.parseTags()
      .then((tagNames: string[]) => {
        setTagNameArray(tagNames);
        setTagNameArrayUpdated(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /* const keybindsMap: { [key: string]: string } = { */
  /*   'a': 'Add new task:', */
  /*   'd': 'Mark task as complete. Are you sure? (y/n)', */
  /*   'c': 'Change task attributes:', */
  /*   'u': 'Revert to the previous state? (y/n)', */
  /*   'x': 'Delete task? (y/n)', */
  /* }; */
  /* const modifyKeybindsMap: { [key: string]: string } = { */
  /*   'd': 'Change task due:', */
  /*   'm': 'Change task description:', */
  /*   'p': 'Change task project:', */
  /*   't': 'Change task tag:', */
  /* }; */
  const promptHandlers: PromptHandlerMap = {
    'Add new task:': addTaskSubmitHandler,
    'Change task attributes:': modifyTaskHandler,
    'Mark task as complete. Are you sure? (y/n)': () => {
      database.completeTask(focusedTaskID);
      reloadTagRecord();
      setFocusedTaskID(-1);
    },
    'Revert to the previous state? (y/n)': () => {
      database.undoTask();
      reloadTagRecord();
      setFocusedTaskID(-1);
    },
    'Delete task? (y/n)': () => {
      database.deleteTask(focusedTaskID);
      reloadTagRecord();
      setFocusedTaskID(-1);
    },
  };

  const keybindsMap: { [key: string]: string } = {
    'a': 'Add new task:',
    'd': 'Mark task as complete. Are you sure? (y/n)',
    'c': 'Change task attributes:',
    'u': 'Revert to the previous state? (y/n)',
    'x': 'Delete task? (y/n)',
    'md': 'Change task due:',
    'mm': 'Change task description:',
    'mp': 'Change task project:',
    'mt': 'Change task tag:',
  };

  const [keySequence, setKeySequence] = useState<string[]>([]);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (currentPrompt === '') {
      if (/\d/.test(event.key)) { // if a digit is pressed
        setKeySequence([...keySequence, event.key]);
        return;
      }
      if (keySequence) {
        if (event.key === 'g') {
          let parsedNumber: number = parseInt(keySequence.join(''));
          if (parsedNumber) {
            console.log(parsedNumber);
          }
          else {
            console.log("not a number");
          }
        }
      }

      const prompt = keybindsMap[keySequence.join('') + event.key];
      if (prompt) {
        setCurrentPrompt(prompt);
        setKeySequence([]);
        event.preventDefault();
        return;
      }

      if (event.key === 'm' || event.key === 'z') {
        setKeySequence([...keySequence, event.key]);
        event.preventDefault();
        return;
      }

      setKeySequence([]);
    }
  }, [currentPrompt, keySequence]);

  useEffect(() => {
    if (keySequence.length !== 0) {
      console.log(keySequence);
    }
  }, [keySequence]);

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
    setCurrentPrompt('a');
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
          <Prompt
            isOpen={currentPrompt !== ''}
            onClose={() => setCurrentPrompt('')}
            promptType={currentPrompt}
            handlers={promptHandlers}
          />

          {render.renderTasks(focusedTagName, focusedProjectName, focusedTaskID, tagRecord, handleTaskClick)}

        </div>
      </div>
    </div>
  );
}

export default TaskWarrior;
