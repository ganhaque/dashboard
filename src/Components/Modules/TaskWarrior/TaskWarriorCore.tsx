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

type PromptProps = {
  isOpen: boolean;
  onClose: () => void;
  promptType: string;
  handlers: PromptHandlerMap;
};

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

  const completeTaskHandler = () => {
    database.completeTask(focusedTaskID);
    reloadTagRecord();
    setFocusedTaskID(-1);
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (currentPrompt === '') {
      if (event.key === 'a') {
        setCurrentPrompt('Add new task:');
        // prevent 'a' from being inserted into input box
        event.preventDefault();
      }
      else if (event.key === 'd') {
        setCurrentPrompt('Mark task as complete. Are you sure? (y/n)');
        event.preventDefault();
      }
      else if (event.key === 'm') {
        setCurrentPrompt('Change task attributes:');
        event.preventDefault();
      }
    }
  }, [currentPrompt]);

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

  const handleSubmitName = (name: string) => {
    console.log(`Hello, ${name}!`);
  };

  const handleSubmitColor = (color: string) => {
    console.log(`Your favorite color is ${color}.`);
  };

  const promptHandlers: PromptHandlerMap = {
    'Add new task:': addTaskSubmitHandler,
    'name': handleSubmitName,
    'color': () => handleSubmitColor,
    'Mark task as complete. Are you sure? (y/n)': completeTaskHandler,
    'Change task attributes:': modifyTaskHandler
  };

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
