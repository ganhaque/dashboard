import Task from "../../Pages/Task";
import { useState, useEffect } from "react";

const EMPTY_JSON = "[\n]\n";

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
  due?: string;
}

interface Project {
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
}

interface Tag {
  projects: Record<string, Project>;
  projectNames: string[];

  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
}

interface TagRecord {
  [key: string]: Tag;
}

// Parse all tags
export const parseTags = (): Promise<string[]> => {
  const cmd = `task tag | head -n -2 | tail -n +4 | cut -f1 -d' ' `;
  return new Promise((resolve, reject) => {
    if (window.electronAPI?.executeCommand) {
      window.electronAPI
        .executeCommand(cmd)
        .then((output) => {
          const tagsArr = output.trim().split(/\r?\n/);
          resolve(tagsArr);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      reject("executeCommand not available");
    }
  });
};

export function useParseTasksForTag(tagName: string) {
  const [tagRecord, setTagRecord] = useState<TagRecord>({});

  const resetTagRecord = async () => {
    setTagRecord({});
    await parseTasksForTag(tagName);
  };

  const parseTasksForTag = async (tagName: string) => {
    const unsetContext = `task context none; `;
    /* const filters = `task tag:'${focusedTag}' `; */
    const filters = `task tag:'${tagName}' `;
    const status = `'(status:pending or status:waiting or status:completed)' `;
    const cmd = unsetContext + filters + status + `export rc.json.array=on`;
    console.log(cmd);
    if (window.electronAPI?.executeCommand) {
      try {
        const output = await window.electronAPI.executeCommand(cmd);
        const isOutputEmpty = output === "" || output === EMPTY_JSON;
        if (isOutputEmpty) return;

        setTagRecord((prevTagRecord) => {
          /* console.log("focusedTag is", focusedTag); */
          const tag = prevTagRecord[tagName] ?? {
            projects: {},
            projectNames: [],

            tasks: [],
            totalTasks: 0,
            completedTasks: 0,
          };

          const outputJSONArr = JSON.parse(output);
          outputJSONArr.map((line: Task) => {
            const newProjectName = line.project || "unsorted";
            if (!tag.projects[newProjectName]) {
              tag.projectNames.push(newProjectName);
              tag.projects[newProjectName] = {
                tasks: [],
                totalTasks: 0,
                completedTasks: 0,
              };
            }
            const isTaskExistsInProject = tag.projects[newProjectName].tasks.some(
              (task) => task.uuid === line.uuid
            );
            if (!isTaskExistsInProject) {
              if (line.status === "completed") {
                tag.completedTasks += 1;
                tag.projects[newProjectName].completedTasks += 1;
              }
              tag.totalTasks += 1;
              tag.projects[newProjectName].totalTasks += 1;
              tag.projects[newProjectName].tasks.push(line);
              tag.tasks.push(line);
            }
            // sort tasks by urgency
            tag.projects[newProjectName].tasks.sort((a, b) => b.urgency - a.urgency);
          });


          return { ...prevTagRecord, [tagName]: tag };
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    parseTasksForTag(tagName);
  }, [tagName]);


  const updateTagRecord = async (newTagName: string) => {
    setTagRecord((prevTagRecord) => {
      // copy the previous `tagRecord` state
      const newTagRecord = { ...prevTagRecord };
      // if `newTagName` already exists in `newTagRecord`, return the current state
      if (newTagName in newTagRecord) {
        return newTagRecord;
      }
      // add the new tag to `newTagRecord`
      newTagRecord[newTagName] = {
        projects: {},
        projectNames: [],
        tasks: [],
        totalTasks: 0,
        completedTasks: 0,
      };
      // call `parseTasksForTag` to update the new tag's data
      parseTasksForTag(newTagName);
      return newTagRecord;
    });
  };

  /* const updateTagRecord = async (tagName: string) => { */
  /*   console.log("update tagRecord for tag", tagName); */
  /*   setFocusedTag(tagName); */
  /* }; */

  return { tagRecord, updateTagRecord, resetTagRecord };
}






/* const tagsArr = tags; */


// Used to update only one project (almost positively the focused project).
// Called after the user modifies a task to reflect the user's changes.
export const parseTasksForProject = (tag: string, project: string) => {
  const unsetContext = `task context none; `;
  const filters = `task tag:'${tag}' project:'${project}' `
  const status = `'(status:pending or status:waiting)' `
  const cmd = unsetContext + filters + status + `export rc.json.array=on`;
  if (window.electronAPI?.executeCommand) {
    window.electronAPI.executeCommand(cmd)
      .then((output) => {
        const isOutputEmpty = output === EMPTY_JSON || output === '';
        if (isOutputEmpty) return;

        // if tag is not in array yet (but cmd specified the tag???)
        /* if (!tags[tag]) { */
        /*   addNewTag(tag); */
        /* } */

        const jsonArr = JSON.parse(output);


        console.log(output);

        /* self.tags[tag].projects[project].tasks = json.decode(stdout) */
        /* self:sort_task_descriptions(tag, project) */
        /* self:emit_signal("ready::project_tasks", tag, project) */

      })
      .catch((err) => {
        console.error(err);
      });
  }
};

// Get number of all tasks for project - completed and pending
// The other function only returns pending tasks.
// This information is required by project list and header.
export const parseTotalTasksForProject = (tag: string, project: string) => {
  const unsetContext = `task context none; `;
  const filters = `task tag:'${tag}' project:'${project}' `
  const status = `'(status:pending or status:completed or status:waiting)' `
  const cmd = unsetContext + filters + status + `count`;
  if (window.electronAPI?.executeCommand) {
    window.electronAPI.executeCommand(cmd)
      .then((output) => {
        /* const isOutputEmpty = output === EMPTY_JSON || output === ''; */
        /* if (isOutputEmpty) return; */

        console.log(output);

        /* local total = tonumber(stdout) or 0 */
        /* -- to be used in calc_completion_percentage */
        /* self.tags[tag].projects[project].total = total */
        /**/
        /* local ready = self.tags[tag].projects_ready + 1 */
        /* self.tags[tag].projects_ready = ready */
        /* if ready >= #self.tags[tag].project_names then */
        /*   self:emit_signal("ready::project_information", tag) */
        /* end */
      })
      .catch((err) => {
        console.error(err);
      });
  }
};


