// TODO: get events from google calendar
import Time from '../Modules/Time';
import ProgressBar from '../Modules/ProgresBar';

const testData = [
  { bgcolor: "rgba(var(--primary))", completed: 60 },
];

function TaskColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-2">
      <div className="item flex-no-grow">
        {testData.map((item, idx) => (
          <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;
