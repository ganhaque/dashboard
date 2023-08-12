import TaskWarrior from "../Modules/TaskWarrior/TaskWarriorCore";
import TaskPage from "../Modules/TestingGround/CustomTask"
import { Toaster } from "../Modules/TestingGround/Components/Toaster";

function Task() {
  return (
    <div className="main flex-container">
      {/* <TaskWarrior /> */}
      <TaskPage />
      <Toaster />
    </div>
  );
}

export default Task;

