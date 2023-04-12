
import HomePage from "./Pages/HomePage";
import Task from "./Pages/Task";
import { defaultApp } from "process";

interface ThingProps {
  activeItem: string;
}

interface Pages {
  [key: string]: JSX.Element;
}

const pages : Pages = {
  'home' : <HomePage />,
  'lightning' : <Task />,
  'finance' : <h1>Here's the Finance Page!</h1>,
  'calendar' : <h1>Check out the Calendar Page!</h1>,
  'add' : <h1>Add a new thing here!</h1>,
  /* 'settings' : <h1>Configure your settings here!</h1>, */
};

const MainPage = ({ activeItem }: ThingProps) => {
  const activeComponent = pages[activeItem] || <h1>404 Page Not Found</h1>;
  return activeComponent;
};

export default MainPage;
