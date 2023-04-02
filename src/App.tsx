import React from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import HomePage from './Components/Pages/HomePage';
import SideBar from './Components/Sidebar/SideBar';
/* import SwitchColor from './Components/Theme'; */
import { useState, useEffect } from 'react';

interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
}

const colorPalettes : { [key: string]: ColorPalette }= {
  'red': { primary: 'red', secondary: 'orange' , tertiary: 'yellow', quaternary: 'catppuccin_green'},
  'green': { primary: 'vibrant_green', secondary: 'catppuccin_green', tertiary: 'green', quaternary: "vibrant_green" },
  /* 'green-green': { primary: 'catppuccin_green', secondary: 'vibrant_green' }, */
  'purple-pink': { primary: 'catppuccin_lavender', secondary: 'purple', tertiary: 'blue', quaternary: 'cyan'},
  // Add more color palettes here as needed
};

const handleColorChange = (paletteName: string) => {
  const palette = colorPalettes[paletteName] || colorPalettes['green'];
  document.documentElement.style.setProperty('--primary', `var(--${palette.primary})`);
  document.documentElement.style.setProperty('--secondary', `var(--${palette.secondary})`);
  document.documentElement.style.setProperty('--tertiary', `var(--${palette.tertiary})`);
  document.documentElement.style.setProperty('--quaternary', `var(--${palette.quaternary})`);
};

const App = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [colorPaletteIndex, setColorPaletteIndex] = useState(0);

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

interface ThingProps {
  activeItem: string;
}

interface Pages {
  [key: string]: JSX.Element;
}

const pages : Pages = {
  'home' : <HomePage />,
  'lightning' : <h1>This is the Lightning Page!</h1>,
  'finance' : <h1>Here's the Finance Page!</h1>,
  'calendar' : <h1>Check out the Calendar Page!</h1>,
  'add' : <h1>Add a new thing here!</h1>,
  /* 'settings' : <h1>Configure your settings here!</h1>, */
};

const MainPage = ({ activeItem }: ThingProps) => {
  const activeComponent = pages[activeItem] || <h1>404 Page Not Found</h1>;
  return activeComponent;
};

export default App;
