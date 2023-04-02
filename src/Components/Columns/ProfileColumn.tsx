import Quests from '../Modules/Quest';
/* import Time from '../Modules/Time'; */
/* import Weather from '../Modules/Weather'; */
/* import Time from '../Modules/Time'; */
import Profile from './Profile';
import GitHubGraph from '../Modules/GithubGraph';
import MyComponent from '../Modules/TimeWarrior';

function ProfileColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-1">
      <Profile />
      <MyComponent />
      <Quests />
      {/* <GitHubGraph username="your-github-username" year={2023} /> */}
      <GitHubGraph username="ganhaque" year={2023} />
      {/* <Time /> */}
      {/* <Weather /> */}
    </div>
  );
}

export default ProfileColumn;

