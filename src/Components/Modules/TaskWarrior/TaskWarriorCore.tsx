
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

interface TaskWarriorExport {
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

interface Task {
  description: string;
}

interface Project {
  tasks: Record<string, Task>;
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


function TaskWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [tagNameArray, setTagNameArray] = useState<string[]>([]);
  const [projectNameArray, setProjectNameArray] = useState<string[]>([]);

  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [focusedTagName, setFocusedTag] = useState<string>('');
  const [focusedProject, setFocusedProject] = useState<string>('');

  const [tagRecord, setTagRecord] = useState<Record<string, Tag>>({});
  const [projectRecord, setProjectRecord] = useState<Record<string, Project>>({});
  const [taskRecord, setTaskRecord] = useState<Record<string, Task>>({});

  // initialization
  useEffect(() => {
    parser.parseTags()
      .then((tagNames: string[]) => setTagNameArray(tagNames))
      .catch((err) => {
        console.error(err);
      });

    /* parseTasksForTag(focusedTagName); */
  }, []);

  // on change to tagNameArray (handle completed signal)
  useEffect(() => {
    setFocusedTag(tagNameArray[0]);
  }, [tagNameArray]);

  const addNewProject = (tagName: string, projectName: string) => {
    setTagRecord((prevTagRecord) => {
      const tag = prevTagRecord[tagName] ?? {
        projects: {},
        projectNames: []
      };
      const project = {
        tasks: {},
        totalTasks: 0,
        /* accent: beautiful.random_accent_color() */
      };
      tag.projects[projectName] = project;
      tag.projectNames.push(projectName);
      return { ...prevTagRecord, [tagName]: tag };
    });
  }

  // Parse all pending tasks for a given tag and then sort them by project
  // (this is the way to initially obtain the list of projects for a tag) 
  const parseTasksForTag = (tagName: string) => {
    const unsetContext = `task context none; `;
    const filters = `task tag:'${tagName}' `;
    const status = `'(status:pending or status:waiting)' `
    const cmd = unsetContext + filters + status + `export rc.json.array=on`;
    if (window.electronAPI?.executeCommand) {
      window.electronAPI.executeCommand(cmd)
        .then((output) => {
          const isOutputEmpty = output === EMPTY_JSON || output === '';
          if (isOutputEmpty) return;

          /* console.log(output); */
          const outputJSONArr = JSON.parse(output);
          setTagRecord((prevTagRecord) => {
            const tag = prevTagRecord[tagName] ?? { projects: {}, projectNames: [] };
            for (const task of outputJSONArr) {
              const projectName = task.project || 'Unsorted';
              if (!tag.projects[projectName]) {
                const newProject = {
                  tasks: {},
                  totalTasks: 0,
                  /* accent: beautiful.random_accent_color() */
                };
                tag.projects[projectName] = newProject;
                tag.projectNames.push(projectName);
              }
              tag.projects[projectName].tasks[task.description] = task;
              tag.projects[projectName].totalTasks++;
              setTaskRecord((prevTaskRecord) => {
                return { ...prevTaskRecord, [task.description]: task };
              });
            }
            return { ...prevTagRecord, [tagName]: tag };
          });
        })
        .catch((err) => {
          console.error(err);
        });
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
