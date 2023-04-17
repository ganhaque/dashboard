import HomePage from "./Pages/HomePage";
import Task from "./Pages/Task";

interface MainPageProps {
  activeItemIndex: number;
}

const pages = [
  <HomePage />,
  <Task />,
  <h1>Here's the Finance Page!</h1>,
  <h1>Check out the Calendar Page!</h1>,
  <h1>Add a new thing here!</h1>,
];

const MainPage = ({ activeItemIndex }: MainPageProps) => {
  const activeComponent = pages[activeItemIndex] ||
    <div id="not-found">
      <h1>404 Page Not Found</h1>
    </div>;
  return activeComponent;
};

export default MainPage;

