import Time from '../../Modules/Time';
import Weather from '../../Modules/Weather';

function TimeColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-2">
      <Time />
      <Weather />
      {/* <Time /> */}
      {/* <Weather /> */}
    </div>
  );
}

export default TimeColumn;
