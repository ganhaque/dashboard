
// TODO:
// parse task export
// selective reload

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

import { useState, useEffect } from 'react';
import ProgressBar from '../ProgresBar';
import './TaskWarrior.css';
/* import formatTime from '../Helpers/formatter'; */
/* import { parseTasksForTag } from './Parser'; */
import * as parser from './Parser';
import * as database from './Database';

/* const items = [ */
/*   { name: 'Home', index: 'home', description: 'where the heart is' }, */
/*   { name: 'Themes', index: 'themes', description: 'colorful' }, */
/* ]; */

const EMPTY_JSON = "[\n]\n";

declare global {
  interface Window {
    /* electronAPI: { */
    /* taskAllTags?: (tag: string) => Promise<string>; */
    timewTagTotal?: (tag: string) => Promise<string>;
    /* }; */
  }
}

interface Task {
  id: number;
  description: string;
  entry: string;
  modified: string;
  project?: string;
  status: string;
  uuid: string;
  tags?: string[];
  urgency: number;
}

interface Project {
  tasks: Task[];
  totalTasks: number;
}

interface Tag {
  projects: Record<string, Project>;
  projectNames: string[];
}

/* local desc = tasks[i]["description"] */
/* local due  = tasks[i]["due"] */
/* local urg  = tasks[i]["urgency"] */
/* local tag  = tasks[i]["tag"] */
/* local proj = tasks[i]["project"] */


/* I think the error is with my initialization with tagRecord. I just do {} instead of giving proper project member.   const [tagRecord, setTagRecord] = useState<Record<string, Tag>>({}); */

function TaskWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [tagNameArray, setTagNameArray] = useState<string[]>([]);

  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [focusedTagName, setFocusedTag] = useState<string>('');
  const [focusedProject, setFocusedProject] = useState<string>('');

  const [tagRecord, setTagRecord] = useState<Record<string, Tag>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // initialization
  useEffect(() => {
    parser.parseTags()
      .then((tagNames: string[]) => setTagNameArray(tagNames))
      .catch((err) => {
        console.error(err);
      });

  }, []);

  // on change to tagNameArray (handle completed signal)
  useEffect(() => {
    setFocusedTag(tagNameArray[0]);
    /* console.log(focusedTagName); */
    /* console.log(tagRecord); */
    parseTasksForTag(focusedTagName);
  }, [tagNameArray]);

  const addTagName = (tagName:string) => {
    // cycle through tagNameArray
    // if match end
    // if not add to end of array
    /* setTagNameArray((prevTagNameArray) => [...prevTagNameArray, tagName]); */
  };

  const addNewProject = (tagName: string, projectName: string) => {
    setTagRecord((prevTagRecord) => {
      const tag = prevTagRecord[tagName] ?? {
        projects: {},
        projectNames: []
      };
      const project = {
        tasks: [],
        totalTasks: 0,
        /* accent: beautiful.random_accent_color() */
      };
      tag.projects[projectName] = project;
      tag.projectNames.push(projectName);
      return { ...prevTagRecord, [tagName]: tag };
    });
  }

  const addNewTag = (tagName: string) => {
    return new Promise((resolve) => {
      setTagRecord((prevTagRecord) => {
        const tag = prevTagRecord[tagName] ?? {
          projects: {},
          projectNames: []
        };
        resolve(tag);
        console.log("done");
        return { ...prevTagRecord, [tagName]: tag };
      });
    });
  };

  // Parse all pending tasks for a given tag and then sort them by project
  const parseTasksForTag = async (tag: string) => {
    const unsetContext = `task context none; `;
    const filters = `task tag:'${tag}' `;
    const status = `'(status:pending or status:waiting)' `
    const cmd = unsetContext + filters + status + `export rc.json.array=on`;
    if (window.electronAPI?.executeCommand) {
      try {
        const output = await window.electronAPI.executeCommand(cmd);
        const isOutputEmpty = output === EMPTY_JSON || output === '';
        if (isOutputEmpty) return;

        if(!tagRecord[tag]) {
          console.log("processing");
          console.log(await addNewTag(tag));
        }

        console.log("after done");

        const outputJSONArr = JSON.parse(output);
        outputJSONArr.map((line: Task) => {
          const newProjectName = line.project || 'Unsorted';
          console.log("tag record: ", tagRecord[tag]);
          if (!tagRecord[tag].projects[newProjectName]) {
            addNewProject(tag, newProjectName);
          }
          tagRecord[tag].projects[newProjectName].tasks.push(line);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    setFocusedTag(tag);
  }

  function renderTags() {
    return tagNameArray.map((tag) => 
      <p
        key={tag}
        className={`tag ${tag === focusedTagName ? 'focused-tag' : ''}`}
        onClick={() => handleTagClick(tag)}>{tag}
      </p>
    );
  }

  const renderTasks = () => {
    return (
      <div className="flex-container column-flex-direction">
        <div className="flex-container">
          <p>
            No tags or project selected
          </p>
          <p>
            Due
          </p>
          <p>
            urgency#
          </p>
        </div>
        <p>
          No tags or project selected
        </p>
      </div>
    )
  }

  return (
    <div className="flex-container" id="bigbox">
      <div className="flex-container column-flex-direction flex-no-grow" id="tag-project-column">
        <h2 className="header">
          Questlog
        </h2>
        <div className="item">
          <h2 className="header">
            Tags
          </h2>
          {renderTags()}
        </div>
        <div className="item">
          <h2 className="header">
            Projects
          </h2>
          {/* <p> */}
          {/*   render projects here */}
          {/* </p> */}
        </div>
      </div>
      <div className="flex-container column-flex-direction" id="column-2">
        <div className="item justify-content-flex-start">
          <div className='flex-container' id="">
            <div>
              <h2 className="header" id="task-header">
                Tasks
              </h2>
              <p className="" id="task-header">
                {focusedTagName} - 1/?? REMAINING
              </p>
            </div>
            <h1 className='header' id="percent-header">
              72%
            </h1>
          </div>

          <ProgressBar key={"thing"} bgcolor="rgba(var(--secondary))" completed={72} />

          {renderTasks()}
        </div>
      </div>
    </div>
  );
}

export default TaskWarrior;
