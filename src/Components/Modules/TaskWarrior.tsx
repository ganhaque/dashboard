// TODO:
// parse task export
// selective reload

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

// For interfacing with Taskwarrior.
// The way this entire module is written is so fucking confusing lmao sorry but
// I have provided as much documentation as I can

// SIGNALS            EMITTED WHEN
// --------------     -----------------
// ready::tag_names        Tags have been parsed
// ready::project_information    Projects for a given tag have been parsed
// selected::tag      A tag has been selected (emitted in tags.lua)
// selected::project  A project has been selected (emitted in projects.lua)
// input::request     A valid keybind is pressed. Triggers awful.prompt. (handled in prompt.lua)
// input::complete    User has completed input. (emitted by prompt.lua, caught here)

// STRUCTURE: VARS
// -------------------
// # focused_tag     : (string) name of currently focused tag
// # focused_project : (string) name of currently focused project
// # focused_task    : (table) json data parsed from taskwarrior
// # task_index      : (int) current nav_tasklist position (used for scrolling + restore)
// # old_task_index  : (int) previous nav_tasklist position (used for scrolling)
// # projects_ready  : (int) used for backend only
//      - for each project there is another async call to get the total # of tasks (both completed and pending)
//      - this counts how many of those async calls have been completed
//      - once (# async calls completed == # projects), the relevant UI components update

// STRUCTURE: TASKWARRIOR DATA
// -------------------------------
// # tag_names : (table) all active tags, indexed numerically
// # tags{}    : (table) all active tags, indexed by tag name
//   # projects_ready : (int) number of projects have their total task count available
//   # project_names  : (table of strings) all active project names
//   # projects{} : table of all active projects associated with tag, indexed by project name
//     # tasks{}  : table of all active tasks in project, indexed numerically

// INITIALIZATION PIPELINE
// ---------------------------
// At module initialization, init flag is set to true
// After every stage, inits_complete--
// Once inits_complete == NUM_COMPONENTS, initialization has completed
//                
//                 ready::  ┌────────────┐     ready::tasks     ┌─────────────────────┐       ready::
//  ┌────────────┐tag_names │parse_tasks_│ ready::project_names │ parse_total_tasks_  │ project_information     init
//  │parse_tags()│───┬─────►│ for_tags() │──────────┬─────────► │    for_project()    │─────────┬───────────► complete!
//  └────────────┘   ▼      └────────────┘          ▼           └─────────────────────┘         ▼
//               UI update:                     UI update:                                  UI update:
//                  tags                         tasklist                               header, project list


import { useState, useEffect } from 'react';
import ProgressBar from './ProgresBar';
import './TaskWarrior.css';
import formatTime from '../Helpers/formatter';

import { ElectronAPI } from '../../ElectronAPI';

const items = [
  { name: 'Home', index: 'home', description: 'where the heart is' },
  { name: 'Themes', index: 'themes', description: 'colorful' },
];

const testData = [
  { bgcolor: "rgba(var(--primary))", completed: 60 },
];

declare global {
  interface Window {
    /* electronAPI: { */
    /* taskAllTags?: (tag: string) => Promise<string>; */
    timewTagTotal?: (tag: string) => Promise<string>;
    /* }; */
  }
}

interface Task {
  description: string;
}

interface Project {
  tasks: Task[];
  total: number;
}

interface Tag {
  projects: { [project: string]: Project };
  project_names: string[];
}

/* const addNewProject = (tags: Tags, tag: string, newProject: string): Tags => { */
/*   const newProjects = { */
/*     ...tags[tag].projects, */
/*     [newProject]: { */
/*       tasks: [], */
/*       total: 0, */
/*     } */
/*   }; */
/*   const newProjectNames = [...tags[tag].project_names, newProject]; */
/*   return { */
/*     ...tags, */
/*     [tag]: { */
/*       ...tags[tag], */
/*       projects: newProjects, */
/*       project_names: newProjectNames */
/*     } */
/*   }; */
/* }; */

function TaskWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalTime, setTotalTime] = useState('');
  const [currentTime, setCurrentTime] = useState(''); // to store current time
  const [curretTag, setCurrentTag] = useState(''); // to store current tag

  const [focusedTask, setFocusedTask] = useState({}); // (table) json data parsed from taskwarrior
  const [focusedTag, setFocusedTag] = useState('');
  const [focusedProject, setFocusedProject] = useState('');
  const [tag, setTag] = useState('');









  const renderTasks = () => {
    if (focusedTag != '') {
      return (
        <div>
        </div>
      )
    }

    return (
      <div>
        <p>
          No tags or project selected
        </p>
      </div>
    )
  }

  return (
    <div className="flex-container" id="bigbox">
      <div className="flex-container column-flex-direction flex-no-grow" id="column-2">
        <h2 className="header">
          Questlog
        </h2>
        <div className="item">
          <h2 className="header">
            Tags
          </h2>
          <p>
            render tags here
          </p>
          <p>
            render tags here
          </p>
        </div>
        <div className="item">
          <h2 className="header">
            Projects
          </h2>
          <p>
            render projects here
          </p>
          <p>
            render projects here
          </p>
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
                PORT MOON - 1/?? REMAINING
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
