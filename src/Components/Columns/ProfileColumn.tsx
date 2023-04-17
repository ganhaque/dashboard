import Quests from '../Modules/Quest';
/* import Time from '../Modules/Time'; */
/* import Weather from '../Modules/Weather'; */
/* import Time from '../Modules/Time'; */
import Profile from './Profile';
import QuoteOfTheDay from '../Modules/QuoteOfTheDay';
import Time from '../Modules/Time';
/* import GitHubGraph from '../Modules/GithubGraph'; */
import Playerctl from '../Modules/Playerctl';
/* import MyComponent from '../Modules/TimeWarrior'; */

function ProfileColumn() {
  return (
    <div className="flex-container column-flex-direction" id="column-1">
      <Profile />
      <Time />
      {/* <MyComponent /> */}
      {/* <div className="item"> */}
      {/*   <QuoteOfTheDay /> */}
      {/* </div> */}
      <Playerctl />
      <Quests />
      {/* <GitHubGraph username="your-github-username" year={2023} /> */}
      {/* <GitHubGraph username="ganhaque" year={2023} /> */}
      {/* <Time /> */}
      {/* <Weather /> */}
    </div>
  );
}

export default ProfileColumn;

