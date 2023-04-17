/* import { useState } from 'react'; */
import {
  BsPlus,
  /* BsFillLightningFill, */
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
import {
  GiSpartanHelmet,
  /* GiHeavyHelm */
  GiRollingDices
} from 'react-icons/gi'
import {
  /* MdTaskAlt */
  /* MdLeaderboard */
  MdOutlineBookmarks
} from 'react-icons/md'
import {
  GoCalendar,
  GoKey
} from "react-icons/go";
import './sidebar.css';

interface SidebarProps {
  activeItem: number;
  onItemClick: (item: number) => void;
}

export const sidebarItems = [
  { name: 'Home', icon: <BsRocketTakeoff size="28" /> },
  { name: 'Taskwarrior', icon: <GiSpartanHelmet size="30" /> },
  { name: 'Finance', icon: <FaDollarSign size="24" /> },
  { name: 'Calendar', icon: <GoCalendar size="28" /> },
  { name: 'Bookmark', icon: <MdOutlineBookmarks size="28" /> },
  /* { name: 'Add', icon: <BsPlus size="32" /> }, */
  { name: 'Game', icon: <GiRollingDices size="32" /> },
  { name: 'Journals', icon: <GoKey size="24" /> },
  { name: 'Themes', icon: <BsSunFill size="24" /> },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps): JSX.Element => {
  return (
    <div className="sidebar">
      {sidebarItems.map((item, index) => (
        <SidebarIcon
          key={index}
          icon={item.icon}
          name={item.name}
          active={activeItem === index}
          onClick={() => onItemClick(index)}
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

