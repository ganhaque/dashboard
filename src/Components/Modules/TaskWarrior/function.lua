-- tasks.lua
------------------------------------------------------------------
local EMPTY_JSON = "[\n]\n"

--- Parse all tags
function task:parse_tags()
  local cmd = "task tag | head -n -2 | tail -n +4 | cut -f1 -d' ' "
  awful.spawn.easy_async_with_shell(cmd, function(stdout)
    local tags = core.split('\r\n', stdout)
    self.tag_names = tags
    self:emit_signal("ready::tag_names")
  end)
end

--- Parse all pending tasks for a given tag and then sort them by project
-- (As far as I'm aware this is the only way to initially obtain the list of projects for a tag) 
function task:parse_tasks_for_tag(tag)
  local cmd = "task context none; task +'"..tag.. "' '(status:pending or status:waiting)' export rc.json.array=on"
  awful.spawn.easy_async_with_shell(cmd, function(stdout)
    if stdout == EMPTY_JSON or stdout == "" then return end

    if not self.tags[tag] then self:add_new_tag(tag) end

    local json_arr = json.decode(stdout)

    -- Iterate through all pending tasks for tag and separate by project
    for i, v in ipairs(json_arr) do
      local pname = json_arr[i]["project"] or "Unsorted"
      if not self.tags[tag].projects[pname] then
        self:add_new_project(tag, pname)
      end
      table.insert(self.tags[tag].projects[pname].tasks, v)
    end

    self:sort_projects(tag)

    for i = 1, #self.tags[tag].project_names do
      local pname = self.tags[tag].project_names[i]
      self:parse_total_tasks_for_project(tag, pname)
      self:sort_task_descriptions(tag, pname)
    end

    self:emit_signal("ready::project_names", tag)
    -- self:emit_signal("ready::tasks", tag)
  end)
end

-- Used to update only one project (almost positively the focused project).
-- Called after the user modifies a task to reflect the user's changes.
function task:parse_tasks_for_project(tag, project)
  local cmd = "task +'"..tag.."' project:'"..project.."' '(status:pending or status:waiting)' export rc.json.array=on"
  awful.spawn.easy_async_with_shell(cmd, function(stdout)
    if stdout == EMPTY_JSON or stdout == "" then return end
    self.tags[tag].projects[project].tasks = json.decode(stdout)
    self:sort_task_descriptions(tag, project)
    self:emit_signal("ready::project_tasks", tag, project)
  end)
end

--- Get number of all tasks for project - completed and pending
-- The other function only returns pending tasks.
-- This information is required by project list and header.
function task:parse_total_tasks_for_project(tag, project)
  local unset_context = "task context none ; "
  local filters = "task +'"..tag.."' project:'"..project.."' "
  local status = " '(status:pending or status:completed or status:waiting)' "
  local cmd = unset_context .. filters .. status .. "count"
  awful.spawn.easy_async_with_shell(cmd, function(stdout)
    local total = tonumber(stdout) or 0
    -- to be used in calc_completion_percentage
    self.tags[tag].projects[project].total = total

    local ready = self.tags[tag].projects_ready + 1
    self.tags[tag].projects_ready = ready
    if ready >= #self.tags[tag].project_names then
      self:emit_signal("ready::project_information", tag)
    end
  end)
end

-- database.lua
------------------------------------------------------------------
--- Sort projects alphabetically
function task:sort_projects(tag)
  table.sort(self.tags[tag].project_names, function(a, b)
    return a < b
  end)
end

-- Sort tasks by due date, then alphabetically 
function task:sort_task_descriptions(tag, project)
  table.sort(self.tags[tag].projects[project].tasks, function(a, b)
    -- If neither have due dates or they have the same due date,
    -- then sort alphabetically
    if (not a.due and not b.due) or (a.due == b.due) then
      return a.description < b.description
    end

    -- Nearest due date should come first
    if a.due and not b.due then
      return true
    elseif not a.due and b.due then
      return false
    else
      return a.due < b.due
    end
  end)
end

-- A bunch of helper functions for data management
function task:add_new_project(tag, new_project)
  self.tags[tag].projects[new_project] = {}
  self.tags[tag].projects[new_project].tasks  = {}
  self.tags[tag].projects[new_project].total  = 0
  self.tags[tag].projects[new_project].accent = beautiful.random_accent_color()
  local pnames = self.tags[tag].project_names
  pnames[#pnames+1] = new_project
end

-- Avoid duplicate tag names
function task:add_tag_name(new_tag)
  for i = 1, #self.tag_names do
    if self.tag_names[i] == new_tag then return end
  end
  local tnames = self.tag_names
  tnames[#tnames+1] = new_tag
end

function task:add_new_tag(new_tag)
  self.tags[new_tag] = {}
  self.tags[new_tag].projects = {}
  self.tags[new_tag].project_names  = {}
  self.tags[new_tag].projects_ready = 0
  self:add_tag_name(new_tag)
end

function task:delete_tag(tag_to_delete)
  for i = 1, #self.tag_names do
    if self.tag_names[i] == tag_to_delete then
      table.remove(self.tag_names, i)
      break
    end
  end
  self.tags[tag_to_delete] = nil
end

function task:delete_project(tag, project_to_delete)
  if not self.tags[tag] then return end
  self.tags[tag].projects[project_to_delete] = nil
  local pnames = self.tags[tag].project_names
  for i = 1, #pnames do
    if pnames[i] == project_to_delete then
      table.remove(pnames, i)
      return
    end
  end
end

function task:adjust_project_total(tag, project, amt)
  self.tags[tag].projects[project].total = self.tags[tag].projects[project].total + amt
end

function task:selective_reload(type, input)
  -- Flag detected by tasklist; used when restoring nav position after reloading
  -- the focused project
  self.restore_required = true

  local ft = self.focused_tag
  local fp = self.focused_project
  local ftask = self.focused_task
  local ntasks = #self.tags[ft].projects[fp].tasks
  local nproj  = #self.tags[ft].project_names

  -- Command types that remove a task from the focused project.
  local remove_task_type = type == "done" or type == "delete"

  if type == "mod_tag"  and input == ft then return end
  if type == "mod_proj" and input == fp then return end

  -- Move focused task to other project within tag
  if type == "mod_proj" then
    local new_project = input

    -- Create project if necessary + move task
    if not self.tags[ft].projects[new_project] then
      self:add_new_project(ft, new_project)
    end

    table.insert(self.tags[ft].projects[new_project].tasks, ftask)
    table.remove(self.tags[ft].projects[fp].tasks, self.task_index)
    self:sort_task_descriptions(ft, new_project)
    self:adjust_project_total(ft, new_project, 1) -- total tasks++ for new proj
    self:adjust_project_total(ft, fp, -1) -- total tasks-- for old proj

    -- If necessary, delete old focused project and set new one
    if ntasks == 1 then
      self:delete_project(ft, fp)
      self.focused_project = new_project
    end

    self:emit_signal("tasklist::update", ft, self.focused_project)
    self:emit_signal("projects::update", ft, self.focused_project)
    self:emit_signal("header::update", ft, self.focused_project)
  end

  -- Move focused task to other tag
  if type == "mod_tag" then
    local new_tag = input

    -- Create tag/project if necessary + move task
    if not self.tags[new_tag] then
      self:add_new_tag(new_tag)
    end

    if not self.tags[new_tag].projects[fp] then
      self:add_new_project(new_tag, fp)
    end

    table.insert(self.tags[new_tag].projects[fp].tasks, ftask)
    table.remove(self.tags[ft].projects[fp].tasks, self.task_index)
    self:sort_task_descriptions(new_tag, fp)
    self:adjust_project_total(new_tag, fp, 1) -- total tasks++ for new proj
    self:adjust_project_total(ft, fp, -1) -- total tasks-- for old proj

    if ntasks == 1 and nproj == 1 then
      -- Since ntask == 1 and nproj == 1, moving this task means the focused project and tag gets erased
      self:delete_tag(ft)
      self.focused_tag = new_tag
      self.focused_project = fp
    elseif ntasks == 1 and nproj > 1 then
      -- Since ntasks == 1 and nproj > 1, moving this task means the focused project gets erased
      -- Focus follows moved task
      self:delete_project(ft, fp)
      self.focused_tag = new_tag
      self.focused_project = fp
    end

    self:emit_signal("tasklist::update", self.focused_tag, self.focused_project)
    self:emit_signal("taglist::update", self.focused_tag, self.focused_project)
    self:emit_signal("projects::update", self.focused_tag, self.focused_project)
    self:emit_signal("header::update", self.focused_tag, self.focused_project)
  end

  if remove_task_type and ntasks == 1 and nproj == 1 then
    -- Since ntasks == 1 and nproj == 1, the focused tag and project get erased
    self:delete_tag(ft)
    self.focused_tag = nil
    self.focused_project = nil
    self:set_focused_tag()
    self:set_focused_project(self.focused_tag, nil)

    self:emit_signal("tasklist::update", self.focused_tag, self.focused_project)
    self:emit_signal("taglist::update", self.focused_tag, self.focused_project)
    self:emit_signal("projects::update", self.focused_tag, self.focused_project)
    self:emit_signal("header::update", self.focused_tag, self.focused_project)
  end

  if remove_task_type and ntasks == 1 then
    if nproj == 1 then
      -- Since ntasks == 1 and nproj == 1, delete focused tag/project
      self:delete_tag(ft)
      self.focused_tag = nil
      self.focused_project = nil
      self:set_focused_tag()
      self:set_focused_project(self.focused_tag, nil)
      self:emit_signal("taglist::update", self.focused_tag, self.focused_project)
    elseif nproj > 1 then
      -- Since ntasks == 1 and nproj > 1, delete focused project
      self:delete_project(ft, fp)
      self.focused_project = nil
      self:set_focused_project(self.focused_tag, nil)
    end

    self:emit_signal("tasklist::update", self.focused_tag, self.focused_project)
    self:emit_signal("projects::update", self.focused_tag, self.focused_project)
    self:emit_signal("header::update", self.focused_tag, self.focused_project)
  end

  if remove_task_type and (ntasks > 1) then
    self:parse_tasks_for_project(ft, fp)
  end

  -- If none of the other cases happen, then just reload current project
  if not (remove_task_type) and not (type == "mod_proj") and not (type == "mod_tag") then
    self:parse_tasks_for_project(ft, fp)
  end
end

--- Sets the focused tag to the given tag.
-- If a tag is not provided: 
--    If focused tag is already set, do nothing.
--    If default tag (in config) exists, set to that.
--    Otherwise set to first tag in tag list.
function task:set_focused_tag(tag)
  if tag then self.focused_tag = tag return end
  if self.focused_tag then return end

  local deftag = config.tasks.default_tag
  local deftag_data_exists = false
  for i = 1, #self.tag_names do
    if self.tag_names[i] == deftag then
      deftag_data_exists = true
      break
    end
  end

  if not self.focused_tag then
    if deftag and deftag_data_exists then
      self.focused_tag = config.tasks.default_tag
    else
      self.focused_tag = self.tag_names[1]
    end
  end
end

--- Sets the focused project to the given project.
-- If a project is not provided, set to the default project.
-- If default project does not exist, set to first project in the project list.
function task:set_focused_project(tag, project)
  if project then
    self.focused_project = project
  elseif not self.focused_project then
    local defproject = config.tasks.default_project
    if defproject and self.tags[tag].projects[defproject] then
      self.focused_project = defproject
    else
      self.focused_project = self.tags[tag].project_names[1]
    end
  end
end

function task:calc_completion_percentage(tag, project)
  tag = tag or self.focused_tag

  local pending   = #self.tags[tag].projects[project].tasks
  local total     = self.tags[tag].projects[project].total
  local completed = total - pending

  return math.floor((completed / total) * 100) or 0
end

-- misc.lua (helper)
------------------------------------------------------------------
--- Convert Taskwarrior's datetime format to a human-readable one
function task:format_date(date, format)
  -- Taskwarrior returns due date as string
  -- Convert that to a lua timestamp
  local pattern = "(%d%d%d%d)(%d%d)(%d%d)T(%d%d)(%d%d)(%d%d)Z"
  local xyear, xmon, xday, xhr, xmin, xsec = date:match(pattern)
  local ts = os.time({
    year = xyear, month = xmon, day = xday,
    hour = xhr, min = xmin, sec = xsec })

  -- account for timezone (america/los_angeles: -8 hours)
  ts = ts - (8 * 60 * 60)

  format = format or '%A %B %d %Y'
  return os.date(format, ts)
end


-- tasks.lua
------------------------------------------------------------------
-- currently tag, proj are unused
local function create_task(desc, due, urg, tag, proj)
  local function format_due_date(due)
    -- taskwarrior returns due date as string
    -- convert that to a lua timestamp
    local pattern = "(%d%d%d%d)(%d%d)(%d%d)T(%d%d)(%d%d)(%d%d)Z"
    local xyear, xmon, xday, xhr, xmin, xsec = due:match(pattern)
    local ts = os.time({
      year = xyear, month = xmon, day = xday,
      hour = xhr, min = xmin, sec = xsec })

    -- turn timestamp into human-readable format
    local now = os.time()
    local time_difference = ts - now
    local abs_time_difference = math.abs(time_difference)
    local days_rem = math.floor(abs_time_difference / 86400)
    local hours_rem = math.floor(abs_time_difference / 3600)

    -- due date formatting
    local due_date_text
    if days_rem >= 1 then -- in x days / x days ago
      due_date_text = days_rem .. " day"
      if days_rem > 1 then
        due_date_text = due_date_text .. "s"
      end
    else -- in x hours / in <1 hour / etc
      if hours_rem == 1 then
        due_date_text = hours_rem .. " hour"
      elseif hours_rem < 1 then
        due_date_text = "&lt;1 hour"
      else
        due_date_text = hours_rem .. " hours"
      end
    end

    if time_difference < 0 then -- overdue
      due_date_text = due_date_text .. " ago"
    else
      due_date_text = "in " .. due_date_text
    end

    return due_date_text
  end

  local due_date_text
  if due then
    due_date_text = format_due_date(due)
  else
    due_date_text = "no due date"
  end

  -- more urgent tasks should be red
  local desc_color = beautiful.fg
  if urg > 7 then
    desc_color = beautiful.red
  end

  -- assemble widget
  local description = wibox.widget({
    markup = colorize(desc, desc_color),
    align = "left",
    widget = wibox.widget.textbox,
    ellipsize = "end",
    forced_width = dpi(360),
  })

  local due_ = wibox.widget({
    markup = colorize(due_date_text, beautiful.task_due_fg),
    align = "right",
    widget = wibox.widget.textbox,
  })

  local task = wibox.widget({
    description,
    nil,
    due_,
    layout = wibox.layout.align.horizontal,
  })

  task_list:add(task)
end

-- use `task export` to get task json, 
-- then convert that to a table
local function update_tasks()
  local cmd = "task limit:8 due.before:7d status:pending export rc.json.array=on"
  awful.spawn.easy_async_with_shell(cmd, function(stdout)
    local empty_json = "[\n]\n"
    if stdout ~= empty_json and stdout ~= "" then
      task_list:remove(1) -- remove placeholder
      local tasks = json.decode(stdout)
      for i, _ in ipairs(tasks) do
        local desc = tasks[i]["description"]
        local due  = tasks[i]["due"]
        local urg  = tasks[i]["urgency"]
        local tag  = tasks[i]["tag"]
        local proj = tasks[i]["project"]
        create_task(desc, due, urg, tag, proj)
      end
    end
  end)
end
