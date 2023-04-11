import ProfileColumn from '../Columns/ProfileColumn';
import TimeColumn from '../Columns/TimeColumn';
import TaskColumn from '../Columns/TaskColumn';

function HomePage() {
  return (
    <div className="main">
      <div className="flex-container" id="bigbox">
        <ProfileColumn />
        {/* <TaskColumn /> */}
        <TimeColumn />

        {/* <h2> */}
        {/*   Hello */}
        {/* </h2> */}
        {/* <Quests /> */}
        {/* <Time /> */}
        {/* <Weather /> */}
      </div>
    </div>
  );
}

export default HomePage;

