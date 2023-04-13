import Task from "../../Pages/Task";

const EMPTY_JSON = "[\n]\n";

// self
//  // tagNames

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

