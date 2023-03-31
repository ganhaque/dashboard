import { useState } from 'react';
import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';
import './sidebar.css';

const SideBar = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState(0);

  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };

  return (
    <div className="sidebar">
      <SideBarIcon icon={<FaFire size="28" />} active={activeItem === 0} onClick={() => handleItemClick(0)} />
      <Divider />
      <SideBarIcon icon={<BsPlus size="32" />} active={activeItem === 1} onClick={() => handleItemClick(1)} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} active={activeItem === 2} onClick={() => handleItemClick(2)} />
      <SideBarIcon icon={<FaPoo size="20" />} active={activeItem === 3} onClick={() => handleItemClick(3)} />
      <Divider />
      <SideBarIcon icon={<BsGearFill size="22" />} active={activeItem === 4} onClick={() => handleItemClick(4)} />
    </div>
  );
};

interface SideBarIconProps {
  icon: JSX.Element;
  text?: string;
  active: boolean;
  onClick: () => void;
}

const SideBarIcon = ({ icon, text = 'tooltip 💡', active, onClick }: SideBarIconProps): JSX.Element => (
  <div className={`sidebar-icon ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span className="sidebar-tooltip">
      {text}
    </span>
  </div>
);

const Divider = (): JSX.Element => <hr className="sidebar-hr" />;

export default SideBar;

