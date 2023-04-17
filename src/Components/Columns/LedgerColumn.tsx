// TODO: get events from google calendar
import Time from '../Modules/Time';
import ProgressBar from '../Modules/ProgresBar';
import Example from '../Modules/Pie';

const testData = [
  { bgcolor: "rgba(var(--primary))", completed: 60 },
];

function LedgerColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-2">
      <div className="item">
        <Example />
      </div>
      {/* <div className="item flex-no-grow"> */}
      {/*   {testData.map((item, idx) => ( */}
      {/*     <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} /> */}
      {/*   ))} */}
      {/* </div> */}
    </div>
  );
}

export default LedgerColumn;
