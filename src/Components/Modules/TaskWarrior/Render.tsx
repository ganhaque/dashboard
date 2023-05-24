import Fuse from 'fuse.js';
import * as helper from './Helper';
import ProgressBar from '../ProgresBar';

interface Task {
  id: number;
  description: string;
  entry: string;
  modified: string;
  priority?: string;
  project?: string;
  status: string;
  uuid: string;
  tags?: string[];
  urgency: number;
  due?: string;
}

export function renderTags(
  tagRecord: any,
  focusedTagName: string,
  tagNameArray: string[],
  handleTagClick: (tag: string) => void
) {
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

export function renderProjects(
  tagRecord: Record<string, { projectNames: string[] }>,
  focusedTagName: string,
  focusedProjectName: string,
  handleProjectClick: (project: string) => void
) {
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

const FILTER_MAP: { [filter: string]: (tasks: any[]) => any[] } = {
  "exclude-completed-tasks": (tasks) => {
    return tasks.filter((task) => task.status !== "completed");
  },
};
export function renderTasks (
  focusedTagName: string,
  focusedProjectName: string,
  focusedTaskID: number,
  tagRecord: any,
  handleTaskClick: (taskID: number) => void,
  filters: Set<string>,
  fuzzySearchString: string,
  searchString: string
) {
  /* console.log("render task is called"); */
  if (!tagRecord[focusedTagName]) {
    return (
      <div id="not-found">
        <p>no tasks exist for current tag</p>
      </div>
    );
  }

  let tasks = tagRecord[focusedTagName]?.tasks;

  if (focusedProjectName !== "") {
    if(!tagRecord[focusedTagName].projects[focusedProjectName]) {
      return (
        <div id="not-found">
          <p>no tasks exist for current project</p>
        </div>
      );
    }
    tasks = tagRecord[focusedTagName]?.projects[focusedProjectName]?.tasks;
  }
  // apply filters
  filters.forEach((filterName) => {
    const filterHandler = FILTER_MAP[filterName];
    if (filterHandler) {
      tasks = filterHandler(tasks);
    }
  });

  // perform fuzzy search
  if (fuzzySearchString) {
    const options = {
      includeScore: true,
      keys: ['name', 'description']
    };

    const fuse = new Fuse(tasks, options);
    tasks = fuse.search(fuzzySearchString).map(result => result.item);
  }

  // apply search string
  if (searchString.trim() !== '') {
    tasks = tasks.filter((task: Task) => {
      const taskTitle = task.description.toLowerCase();
      const searchTerm = searchString.toLowerCase();
      if (taskTitle.includes(searchTerm)) {
        return true;
      }
      if (searchTerm.length > 1 && taskTitle.includes(searchTerm.toUpperCase())) {
        return true;
      }
      return false;
    });
  }

  return renderTaskList(tasks, focusedTaskID, handleTaskClick);
};

const renderTaskList = (
  tasks: any[],
  focusedTaskID:number,
  handleTaskClick: (taskID: number) => void
) => {
  return (
    <div className="flex-container column-flex-direction flex-no-gap" id="task-row-container">
      {tasks.map((task) => (
        <div
          key={task.uuid}
          className={`
${
task.id ===  focusedTaskID ? "selected-task" : ""
}
${
task.status === "completed" ? "completed-task" : ""
}
task-row
flex-container flex-double-gap`}
          id={`task-row-${task.id}`}
          onClick={() => handleTaskClick(task.id)}
        >
          <div className="flex-no-grow" id="task-id">
            <p className="">{task.id}</p>
          </div>
          <div className="" id="task-description">
            <p className={`priority-${task.priority}`}>
              {task.priority ? `(${task.priority}) ` : ""}
              {task.description}
            </p>
          </div>
          <div className="flex-no-grow" id="task-due">
            <p>{task.due ? `due ${helper.formatDueDate(task.due)}` : ""}</p>
          </div>
          <div className="flex-no-grow" id="task-urgency">
            {/* <p> */}
            {/*   {Number(task.urgency).toFixed(1)} */}
            {/* </p> */}
            <p style={{
              color: `rgba(var(--primary), ${0.1 + Math.min(Number(task.urgency) / 10, 1)})`,
              /* textShadow: `1px 1px 0 rgba(255, 255, 255, ${Math.min(Number(task.urgency) / 10, 1)})` */
            }}>
              {Number(task.urgency).toFixed(1)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export function renderHeader(
  tagRecord: any,
  focusedTagName: string,
  focusedProjectName:string
) {
  const isTagSelected = Boolean(tagRecord[focusedTagName]?.totalTasks);
  if (!isTagSelected) {
    return (
      <div id="not-found">
        <p>
          No Tag or Project Selected... (no taskwarrior?)
        </p>
      </div>
    );
  }

  const selectedProject = tagRecord[focusedTagName]?.projects[focusedProjectName];
  const { completedTasks: completedTasksForTag, totalTasks: totalTasksForTag } = tagRecord[focusedTagName];
  const { completedTasks: completedTasksForProject, totalTasks: totalTasksForProject } = selectedProject || {};

  const completedTasks = focusedProjectName ? completedTasksForProject : completedTasksForTag;
  const totalTasks = focusedProjectName ? totalTasksForProject : totalTasksForTag;

  const percentCompleted = Math.floor((completedTasks / totalTasks) * 100);

  return (
    <>
      <div className='flex-container' id="">
        <div>
          <h2 className="header" id="task-header">
            Tasks
          </h2>
          <div className="" id="task-header">
            <p> {
              `${focusedTagName} - ${focusedProjectName ? `${focusedProjectName} - ` : ''}${completedTasks}/${totalTasks} REMAINING`
            } </p>
          </div>
        </div>

        <h1 className='header' id="percent-header">
          {percentCompleted}%
        </h1>
      </div>

      <ProgressBar
        bgcolor="rgba(var(--secondary))"
        completed={percentCompleted}
      />
    </>
  );
}
