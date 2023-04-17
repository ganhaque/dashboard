
// TODO:
// parse task export
// selective reload
// currently, the init run everytime the taskwarrior page (sidebar) is opened
// can be optimized by doing init in the main app.tsx?

// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█ 
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄ 

import { useState, useEffect } from 'react';
import ProgressBar from '../ProgresBar';
import './TaskWarrior.css';
import {
  BsPlus
} from 'react-icons/bs'
/* import formatTime from '../Helpers/formatter'; */
/* import { parseTasksForTag } from './Parser'; */
import * as parser from './Parser';
import * as helper from './Helper';
import * as database from './Database';

const EMPTY_JSON = "[\n]\n";

function TaskWarrior() {
  const [tagNameArray, setTagNameArray] = useState<string[]>([""]);
  const [tagNameArrayInitialized, setTagNameArrayInitialized] = useState(false);

  const [focusedTagName, setFocusedTag] = useState<string>("");
  const [focusedProjectName, setFocusedProjectName] = useState<string>("");
  const [focusedTaskID, setFocusedTaskID] = useState<number>(0);

  const { tagRecord, updateTagRecord } = parser.useParseTasksForTag(focusedTagName);

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
    // reset project when tag change
    setFocusedProjectName('');
    /* updateTagRecord(tag); */
  }

  const handleProjectClick = (project: string) => {
    /* console.log("handle is called for project:", project); */
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
    console.log("Debug");
  }

  function renderTags() {
    if (!tagRecord[focusedTagName]) {
      return <div> Loading... </div>
    }
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
    if (focusedProjectName === "") {
      // TODO: when no project, render all tasks of tag instead
      return (
        <div id="not-found">
          <p>
            no project selected...
          </p>
        </div>
      )
    }
    if (!tagRecord[focusedTagName]?.projects) {
      return (
        <div id="not-found">
          <p>
            no tasks exist for current tag
          </p>
        </div>
      )
    }
    if (!tagRecord[focusedTagName]?.projects[focusedProjectName]?.tasks) {
      return (
        <div id="not-found">
          <p>
            no tasks for current project (this should not happen)
          </p>
        </div>
      )
    }
    const tasks = tagRecord[focusedTagName]?.projects[focusedProjectName]?.tasks;
    return (
      <div className="flex-container column-flex-direction flex-no-gap">
        {tasks.map((task) => (
          <div key={task.id} className={task.status === 'completed' ? 'completed-task' : ''} id="task-grid">
            <div id="task-description">
              <p>
                {task.description}
              </p>
            </div>
            <div className="" id="task-due">
              <p>
                {task.due ? `due: ${helper.formatDueDate(task.due)}` : ''}
              </p>
            </div>
            <div className="" id="task-urgency">
              <p>
                {/* TODO: changes text color based on urgency */}
                {Number(task.urgency).toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderHeader() {
    if (!tagRecord[focusedTagName]?.totalTasks) {
      return (
        <div id="not-found">
          <p>
            No Tag or Project Selected... (no taskwarrior?)
          </p>
        </div>
      )
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
                  `${focusedTagName} - ${completedTasks}/${totalTasks} REMAINING`
                } </p>
              </div>
            </div>

            <h1 className='header' id="percent-header">
              {percent}%
            </h1>
          </div>

          <ProgressBar
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
          bgcolor="rgba(var(--secondary))"
          completed={
            percent
          } />
      </>

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
          <div className="hover-button" onClick={() => debugClick2()}>
            <BsPlus size="32" />
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
