/* import { useState } from 'react'; */
import {
  BsPlus,
  BsFillLightningFill,
  /* BsGearFill, */
  /* BsCalendarHeart, */
  /* BsJournalBookmarkFill, */
  BsRocketTakeoff,
  /* BsHouse */
  /* BsMoonStarsFill, */
  BsSunFill,
  BsClock,
} from 'react-icons/bs';
import {
  /* FaFire, */
  /* FaPoo, */
  /* FaCalendar, */
  FaDollarSign
} from 'react-icons/fa';
import { GoCalendar } from "react-icons/go";
import './sidebar.css';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const sidebarItems = [
  { name: 'Home', index: 'home', icon: <BsRocketTakeoff size="28" /> },
  { name: 'Lightning', index: 'lightning', icon: <BsFillLightningFill size="20" /> },
  { name: 'Finance', index: 'finance', icon: <FaDollarSign size="20" /> },
  { name: 'Calendar', index: 'calendar', icon: <GoCalendar size="24" /> },
  { name: 'Timew', index: 'timew', icon: <BsClock size="24" /> },
  { name: 'Add', index: 'add', icon: <BsPlus size="32" /> },
  { name: 'Themes', index: 'themes', icon: <BsSunFill size="22" /> },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps): JSX.Element => {
  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <SidebarIcon
          key={item.index}
          icon={item.icon}
          name={item.name}
          active={activeItem === item.index}
          onClick={() => onItemClick(item.index)}
          />
      ))}
    </div>
  );
};

interface SidebarIconProps {
  icon: JSX.Element;
  name: string;
  active: boolean;
  onClick: () => void;
}

const SidebarIcon = ({ icon, name, active, onClick }: SidebarIconProps): JSX.Element => (
  <div className={`sidebar-icon ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span className="sidebar-tooltip">
      {name}
    </span>
  </div>
);

export default Sidebar;

