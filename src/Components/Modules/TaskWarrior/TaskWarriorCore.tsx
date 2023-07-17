// TODO:
// parse task export
// selective reload
// currently, the init run everytime the taskwarrior page (sidebar) is opened
// can be optimized by doing init in the main app.tsx?

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

import { useState, useEffect, useCallback, useRef } from 'react';
import './TaskWarrior.css';
import {
  BsPlus
} from 'react-icons/bs'
import * as parser from './Parser';
import * as render from './Render';
import * as database from './Database';
import Prompt from './Prompt';
import Error from './Error';
import Button from '../../UI/Button';
/* import Alert from '../../Alert'; */

const ERROR_DURATION_MS = 1600;

interface PromptHandlerMap {
  [prompt: string]: (inputText: string) => void;
}

function TaskWarrior() {
  const [tagNameArray, setTagNameArray] = useState<string[]>([]);
  const [tagNameArrayInitialized, setTagNameArrayInitialized] = useState(false);
  const [tagNameArrayUpdated, setTagNameArrayUpdated] = useState(false);

  const [focusedTagName, setFocusedTag] = useState<string>("");
  const [focusedProjectName, setFocusedProjectName] = useState<string>("");
  const [focusedTaskID, setFocusedTaskID] = useState<number>(-1);
  /* const [focusedTaskIndex, setFocusedTaskIndex] = useState<number>(0); */

  const { tagRecord, updateTagRecord, resetTagRecord } = parser.useParseTasksForTag('');

  const [currentPrompt, setCurrentPrompt] = useState('');
  const [filterSet, setFilterSet] = useState<Set<string>>(new Set());
  const [fuzzySearchString, setFuzzySearchString] = useState('');
  const [searchString, setSearchString] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const debugItem = useRef(null);

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
      await updateTagRecord(tagName);
    }
  }

  // on change to tagNameArray (handle completed signal)
  useEffect(() => {
    if (tagNameArrayInitialized) {
      setFocusedTag(tagNameArray[0])
      setFocusedProjectName('');
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayInitialized]);
  useEffect(() => {
    if (tagNameArrayUpdated) {
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayUpdated]);

  const scrollIntoView = (taskID: number): void => {
    const taskElement = document.getElementById(`task-row-${taskID}`);
    if (taskElement) {
      const containerElement = document.getElementById("task-row-container");
      if (!containerElement) return;
      const containerCenter = containerElement.offsetHeight / 2;
      const taskTop = taskElement.offsetTop;
      /* const taskBottom = taskTop + taskElement.offsetHeight; */
      const scrollToY = taskTop - containerCenter + (taskElement.offsetHeight / 2);
      containerElement.scrollTo({
        top: scrollToY,
        behavior: "smooth"
      });
    }
  };

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
    /* scrollIntoView(taskID); */
  }

  useEffect(() => {
    scrollIntoView(focusedTaskID);
  }, [focusedTaskID]);

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

  const promptHandlers: PromptHandlerMap = {
    'Add new task:': (userInput) => {
      const parsed = parser.parseUserInput(userInput, focusedTagName, focusedProjectName);

      let taskID: number = -1;
      database.addTask(parsed.tag, parsed.project, parsed.description, parsed.due)
        .then((result) => {
          taskID = result;
          reloadTagRecord();

          setFocusedTag(parsed.tag);
          setFocusedProjectName(parsed.project);
          /* console.log(taskID); */
          setFocusedTaskID(taskID);
        })
        .catch((err) => {
          console.error(err);
        });

    },
    /* 'Change task attributes:': (userInput) => { */
    /* const parsed = parser.parseUserInput(userInput, focusedTagName, focusedProjectName); */
    /* database.modifyTask(focusedTaskID, parsed.tag, parsed.project, parsed.description, parsed.due) */
    /*   reloadTagRecord(); */
    /* }, */
    'Mark task as complete? (y/n)': () => {
      database.completeTask(focusedTaskID);
      reloadTagRecord();
      setFocusedTaskID(-1);
    },
    'Undo? (y/n)': () => {
      database.undoTask();
      reloadTagRecord();
      setFocusedTaskID(-1);
    },
    'Delete task? (y/n)': () => {
      database.deleteTask(focusedTaskID);
      reloadTagRecord();
      setFocusedTaskID(-1);
    },

    'Modify task due:': (userInput: string) => {
      database.modifyTask(focusedTaskID, '', '', '', userInput, '');
      reloadTagRecord();
    },
    'Modify task description:': (userInput: string) => {
      database.modifyTask(focusedTaskID, '', '', userInput, '', '');
      reloadTagRecord();
    },
    'Modify task project:': (userInput: string) => {
      database.modifyTask(focusedTaskID, '', userInput, '', '', '');
      reloadTagRecord();
      setFocusedProjectName(userInput);
    },
    'Modify task tag:': (userInput: string) => {
      database.modifyTask(focusedTaskID, userInput, '', '', '', '');
      reloadTagRecord();
      setFocusedTag(userInput);
    },
    'Modify task priority/severity:': (userInput: string) => {
      if (userInput === '') {
        userInput = ' ';
      }
      database.modifyTask(focusedTaskID, '', '', '', '', userInput);
      reloadTagRecord();
    },

    'Fuzzy-search:': (userInput: string) => {
      setFuzzySearchString(userInput);
    },
    'Search:': (userInput: string) => {
      setSearchString(userInput);
    },
  };
  const promptKeybindMap: { [key: string]: string } = {
    'a': 'Add new task:',
    'd': 'Mark task as complete? (y/n)',
    'u': 'Undo? (y/n)',
    'x': 'Delete task? (y/n)',
    /* 'c': 'Change task attributes:', */
    'md': 'Modify task due:',
    'mh': 'Modify task due hour:',
    'mq': 'Modify task description:',
    'mp': 'Modify task project:',
    'mt': 'Modify task tag:',
    'ms': 'Modify task priority/severity:',
    'g': 'Fuzzy-search:',
    '/': 'Search:',
  };

  const keybindMap: { [key: string]: { prompt: string, handler: (inputText: string) => void } } = {
    'a': {
      prompt: 'Add new task:',
      handler: (userInput) => {
        const parsed = parser.parseUserInput(userInput, focusedTagName, focusedProjectName);

        let taskID: number = -1;
        database.addTask(parsed.tag, parsed.project, parsed.description, parsed.due)
          .then((result) => {
            taskID = result;
            reloadTagRecord();

            setFocusedTag(parsed.tag);
            setFocusedProjectName(parsed.project);
            setFocusedTaskID(taskID);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    'd': {
      prompt: 'Mark task as complete? (y/n)',
      handler: () => {
        database.completeTask(focusedTaskID);
        reloadTagRecord();
        setFocusedTaskID(-1);
      }
    },
    'u': {
      prompt: 'Undo? (y/n)',
      handler: () => {
        database.undoTask();
        reloadTagRecord();
        setFocusedTaskID(-1);
      }
    },
    'x': {
      prompt: 'Delete task? (y/n)',
      handler: () => {
        database.deleteTask(focusedTaskID);
        reloadTagRecord();
        setFocusedTaskID(-1);
      }
    },
    'md': {
      prompt: 'Modify task due:',
      handler: (userInput: string) => {
        database.modifyTask(focusedTaskID, '', '', '', userInput, '');
        reloadTagRecord();
      }
    },
    'mh': {
      prompt: 'Modify task due hour:',
      handler: (userInput: string) => {
        // Handle modifying task due hour
      }
    },
    'mq': {
      prompt: 'Modify task description:',
      handler: (userInput: string) => {
        database.modifyTask(focusedTaskID, '', '', userInput, '', '');
        reloadTagRecord();
      }
    },
    'mp': {
      prompt: 'Modify task project:',
      handler: (userInput: string) => {
        database.modifyTask(focusedTaskID, '', userInput, '', '', '');
        reloadTagRecord();
        setFocusedProjectName(userInput);
      }
    },
    'mt': {
      prompt: 'Modify task tag:',
      handler: (userInput: string) => {
        database.modifyTask(focusedTaskID, userInput, '', '', '', '');
        reloadTagRecord();
        setFocusedTag(userInput);
      }
    },
    'ms': {
      prompt: 'Modify task priority/severity:',
      handler: (userInput: string) => {
        if (userInput === '') {
          userInput = ' ';
        }
        database.modifyTask(focusedTaskID, '', '', '', '', userInput);
        reloadTagRecord();
      }
    },
    'g': {
      prompt: 'Fuzzy-search:',
      handler: (userInput: string) => {
        setFuzzySearchString(userInput);
      }
    },
    '/': {
      prompt: 'Search:',
      handler: (userInput: string) => {
        setSearchString(userInput);
      }
    },
  };

  const nonPromptKeybindMap: { [key: string]: () => void } = {
    'fc': () => { // togle display completed task
      if (filterSet.has("exclude-completed-tasks")) {
        filterSet.delete("exclude-completed-tasks");
        setFilterSet(new Set(filterSet));
      }
      else {
        filterSet.add("exclude-completed-tasks");
        setFilterSet(new Set(filterSet));
      }
    },
    'j': () => {
      if (focusedTagName === '') {
        return;
      }
      if (focusedTaskID === -1) {
        setFocusedTaskID(0);
      }
      let index;
      console.log(focusedTagName);
      for (index = 0; index <= tagRecord[focusedTagName].tasks.length; index++ ) {
        console.log(index);
        if (tagRecord[focusedTagName].tasks[index].id === focusedTaskID) {
          break;
        }
      }
      setFocusedTaskID(tagRecord[focusedTagName].tasks[index + 1].id);
    },
    'k': () => {
      let index;
      if (focusedTagName === '') {
        return;
      }
      console.log(focusedTagName);
      for (index = 1; index < tagRecord[focusedTagName].tasks.length; index++ ) {
        console.log(index);
        if (tagRecord[focusedTagName].tasks[index].id === focusedTaskID) {
          break;
        }
      }
      setFocusedTaskID(tagRecord[focusedTagName].tasks[index - 1].id);
    }
  };
  const numberKeybindMap: { [key: string]: (num: number) => void } = {
    't': (num: number) => {
      console.log(`number: ${num}`);
      if (num === 0 || num > tagNameArray.length) {
        console.error('invalid number');
        return;
      }
      else {
        setFocusedTag(tagNameArray[num - 1]);
      }
    },
    'p': (num: number) => {
      console.log(`number: ${num}`);
      const projectNamesArray = tagRecord[focusedTagName].projectNames;
      if (num === 0 || num > projectNamesArray.length) {
        console.error('invalid number');
        return;
      }
      else {
        if (projectNamesArray[num - 1] === focusedProjectName) {
          setFocusedProjectName('');
        }
        else {
          setFocusedProjectName(projectNamesArray[num - 1]);
        }
      }
    },
    'q': (num: number) => {
      console.log(`number: ${num}`);
      setFocusedTaskID(num);
    },
    /* 'i': (num: number) => { */
    /* console.log(`number: ${num}`); */
    /* setFocusedTaskIndex(num); */
    /* }, */
  };

  const [keySequence, setKeySequence] = useState<string[]>([]);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchString('');
      setFuzzySearchString('');
      setCurrentPrompt('');
    }
    if (currentPrompt === '') {
      if (/\d/.test(event.key)) { // if a digit is pressed
        setKeySequence([...keySequence, event.key]);
        return;
      }
      if (keySequence.length > 0) {
        /* let parsedNumber: number = parseInt(keySequence.join('')); */
        let parsedNumber: number = parseInt(keySequence.join(''), 10);
        if (!isNaN(parsedNumber)) {
          const numberHandler = numberKeybindMap[event.key];
          if (numberHandler) {
            numberHandler(parsedNumber);
            setKeySequence([]);
            event.preventDefault(); // not necessary?
            return;
          }
        }
      }

      const prompt = promptKeybindMap[keySequence.join('') + event.key];
      if (prompt) {
        setCurrentPrompt(prompt);
        setKeySequence([]);
        event.preventDefault();
        return;
      }
      const filterHandler = nonPromptKeybindMap[keySequence.join('') + event.key];
      if (filterHandler) {
        filterHandler();
      }

      if (event.key === 'm' || event.key === 'f') {
        setKeySequence([...keySequence, event.key]);
        event.preventDefault();
        return;
      }

      setKeySequence([]);
    }
  }, [currentPrompt, keySequence]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const debugClick = () => {
    /* console.log("Debug"); */
    /* console.log("tagNameArray:"); */
    /* console.log(tagNameArray); */
    /* console.log("tagRecord:"); */
    /* console.log(tagRecord); */
    /* console.log("focusedTagName"); */
    /* console.log(focusedTagName); */
    /* console.log("focusedProjectName"); */
    /* console.log(focusedProjectName); */
    /* console.log("focusedTaskID"); */
    /* console.log(focusedTaskID); */
    /* console.log("focusedTaskIndex"); */
    /* console.log(focusedTaskIndex); */
    /* console.log(fuzzySearchString); */
    /* setErrorMessage('test error'); */
    /* setTimeout(() => setErrorMessage(''), ERROR_DURATION_MS); // Clear the error message after 1.2 seconds */
  }

  const debugClick2 = () => {
    console.log("Debug2");
    setCurrentPrompt('a');
  }

  const handleButtonClick = () => {
    console.log('Button pressed!');
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

          <Button
            variant="default"
            onPress={handleButtonClick}
          >
            Default
          </Button>

          <Button
            variant="primary"
            onPress={handleButtonClick}
          >
            Primary
          </Button>
          <Button
            variant="secondary"
            onPress={handleButtonClick}
          >
            Secondary
          </Button>

          <Button
            variant="outline"
            onPress={handleButtonClick}
          >
            Outline
          </Button>

          <Button
            variant="primary link"
            onPress={handleButtonClick}
          >
            Link
          </Button>

          {/* <div className="hover-button" onClick={() => debugClick2()}> */}
          {/*   <BsPlus size="32" /> */}
          {/* </div> */}
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
          <Error errorMessage={errorMessage} duration={ERROR_DURATION_MS}/>

          {render.renderTasks(
            focusedTagName, focusedProjectName, focusedTaskID, tagRecord,
            handleTaskClick, filterSet, fuzzySearchString, searchString)}

        </div>
      </div>
      {keySequence.length > 0 &&
        <div className="key-sequence">
          {keySequence.join('')}
        </div>
      }
    </div>
  );
}

export default TaskWarrior;
