
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

interface TagRecord {
  [key: string]: Tag;
}

/* local desc = tasks[i]["description"] */
/* local due  = tasks[i]["due"] */
/* local urg  = tasks[i]["urgency"] */
/* local tag  = tasks[i]["tag"] */
/* local proj = tasks[i]["project"] */


/* I think the error is with my initialization with tagRecord. I just do {} instead of giving proper project member.   const [tagRecord, setTagRecord] = useState<Record<string, Tag>>({}); */

function TaskWarrior() {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [tagNameArray, setTagNameArray] = useState<string[]>([""]);
  const [tagNameArrayInitialized, setTagNameArrayInitialized] = useState(false);

  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [focusedTagName, setFocusedTag] = useState<string>("");
  const [focusedProjectName, setFocusedProjectName] = useState<string>("");
  const { tagRecord, updateTagRecord } = parser.useParseTasksForTag(focusedTagName);
  /* const [tagRecord, setTagRecord] = useState<TagRecord>({}); */
  /* const { tagRecord, setFocusedTagName } = parser.useParseTasksForTag("myTag"); */
  /* const [isProcessing, setIsProcessing] = useState(false); */

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
      console.log(tagNameArray);
      setFocusedTag(tagNameArray[0])
      fetchTagRecords(tagNameArray);
    }
  }, [tagNameArrayInitialized]);


  const handleTagClick = (tag: string) => {
    console.log("handle is called for tag:", tag);
    setFocusedTag(tag);
    /* updateTagRecord(tag); */
  }

  const handleProjectClick = (project: string) => {
    console.log("handle is called for project:", project);
    if (focusedProjectName === project) {
      setFocusedProjectName('');
    }
    else {
      setFocusedProjectName(project);
    }
    /* updateTagRecord(project); */
  }

  const debugClick = () => {
    console.log("Debug");
    console.log(tagRecord);
  }

  function renderTags() {
    return tagNameArray.map((tag) => 
      <p
        key={tag}
        className={`hover-button ${tag === focusedTagName ? 'focused-hover-button' : ''}`}
        onClick={() => handleTagClick(tag)}
      >
        {tag}
      </p>
    );
  }

  function renderProjects() {
    if (!tagRecord[focusedTagName]?.projectNames) {
      return <div> Loading... </div>
    }
    return tagRecord[focusedTagName].projectNames.map((project: string) => 
      <p
        key={project}
        className={`hover-button ${project === focusedProjectName ? 'focused-hover-button' : ''}`}
        onClick={() => handleProjectClick(project)}
      >
        {project}
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

  function renderHeader() {
    if (!tagRecord[focusedTagName]?.totalTasks) {
      return <p> No Tag or Project Selected... </p>
    }

    if (tagRecord[focusedTagName]?.projects[focusedProjectName]?.totalTasks) {
      const completedTasks = tagRecord[focusedTagName]
        .projects[focusedProjectName]
        .completedTasks;
      const totalTasks = tagRecord[focusedTagName]
        .projects[focusedProjectName]
        .totalTasks;
      const percent = Math.floor((completedTasks / totalTasks) * 100);
      return (
        <>
          <div className='flex-container' id="">
            <div>
              <h2 className="header" id="task-header">
                Tasks
              </h2>
              <div className="" id="task-header">
                <p> {
                  `${focusedTagName} - ${completedTasks} / ${totalTasks} REMAINING`
                } </p>
              </div>
            </div>

            <h1 className='header' id="percent-header">
              {percent}%
            </h1>
          </div>

          <ProgressBar
            key={""}
            bgcolor="rgba(var(--secondary))"
            completed={
              percent
            } />
        </>
      )
    }

    const completedTasks = tagRecord[focusedTagName]
      .completedTasks;
    const totalTasks = tagRecord[focusedTagName]
      .totalTasks;
    const percent = Math.floor((completedTasks / totalTasks) * 100);
    return (
      <>
        <div className='flex-container' id="">
          <div>
            <h2 className="header" id="task-header">
              Tasks
            </h2>
            <div className="" id="task-header">
              <p> {
                `${focusedTagName} - ${completedTasks} / ${totalTasks} REMAINING`
              } </p>
            </div>
          </div>

          <h1 className='header' id="percent-header">
            {percent}%
          </h1>
        </div>

        <ProgressBar
          key={""}
          bgcolor="rgba(var(--secondary))"
          completed={
            percent
          } />
      </>

      /*       <p> */
      /*         {`${focusedTagName} -  */
      /* ${tagRecord[focusedTagName].projects[focusedProjectName].completedTasks}/${tagRecord[focusedTagName].projects[focusedProjectName].totalTasks} */
      /* REMAINING`} */
      /*       </p> */
    );
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
        </div>
        <div className="item flex-no-grow">
          <h2 className="header">
            Tags
          </h2>
          {renderTags()}
        </div>
        <div className="item">
          <h2 className="header">
            Projects
          </h2>
          {renderProjects()}
          {/* <p> */}
          {/*   render projects here */}
          {/* </p> */}
        </div>
      </div>
      <div className="flex-container column-flex-direction" id="column-2">
        <div className="item justify-content-flex-start">
          {renderHeader()}
          {renderTasks()}
        </div>
      </div>
    </div>
  );
}

export default TaskWarrior;
