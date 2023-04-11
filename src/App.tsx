import React from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import HomePage from './Components/Pages/HomePage';
import SideBar from './Components/Sidebar/SideBar';
/* import SwitchColor from './Components/Theme'; */
import { useState, useEffect } from 'react';
import Task from './Components/Pages/Task';
import { colorPalettes, handleColorChange } from './Components/ColorPalette';

function getRandomIndex(maxIndex: number) {
  return Math.floor(Math.random() * maxIndex);
}


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


const App = () => {
  const [activeItem, setActiveItem] = useState('home');
  /* const [colorPaletteIndex, setColorPaletteIndex] = useState(0); */
  const [colorPaletteIndex, setColorPaletteIndex] = useState(getRandomIndex(Object.keys(colorPalettes).length));

  const handleSidebarItemClick = (itemIndex : string) => {
    if (itemIndex === 'themes') {
      const numPalettes = Object.keys(colorPalettes).length;
      const nextIndex = (colorPaletteIndex + 1) % numPalettes;
      setColorPaletteIndex(nextIndex);
      /* const nextPaletteName = Object.keys(colorPalettes)[nextIndex]; */
      /* handleColorChange(nextPaletteName); */
    }
    else {
      setActiveItem(itemIndex);
    }
  };

  useEffect(() => {
    const paletteNames = Object.keys(colorPalettes);
    const currentPaletteName = paletteNames[colorPaletteIndex];
    handleColorChange(currentPaletteName);
  }, [colorPaletteIndex]);

  return (
    <div className="App flex-container">
      {/* <SideBar /> */}
      <SideBar activeItem={activeItem} onItemClick={handleSidebarItemClick}  />
      <MainPage activeItem={activeItem} />
    </div>
  );
};

export default App;
