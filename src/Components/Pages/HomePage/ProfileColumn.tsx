import Quests from '../../Modules/Quest';
/* import Time from '../Modules/Time'; */
/* import Weather from '../Modules/Weather'; */
/* import Time from '../Modules/Time'; */
import Profile from './Profile';

function ProfileColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-1">
      <Profile />
      <Quests />
      {/* <Time /> */}
      {/* <Weather /> */}
    </div>
  );
}

export default ProfileColumn;

