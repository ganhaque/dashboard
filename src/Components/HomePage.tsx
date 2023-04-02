import Quests from './Modules/Quest';
import Time from './Modules/Time';
import Weather from './Modules/Weather';
import ProfileColumn from './Pages/HomePage/ProfileColumn';
import TimeColumn from './Pages/HomePage/TimeColumn';
import TaskColumn from './Pages/HomePage/TaskColumn';

function HomePage() {
  return (
    <div className="main">
      <div className="flex-container" id="bigbox">
        <ProfileColumn />
        <TaskColumn />
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

