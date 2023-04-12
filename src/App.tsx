import React from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import SideBar from './Components/Sidebar/SideBar';
/* import SwitchColor from './Components/Theme'; */
import { useState, useEffect } from 'react';
import { colorPalettes, handleColorChange } from './Components/ColorPalette';
import { ElectronAPI } from './ElectronAPI';
import MainPage from './Components/MainPage';
import { getRandomIndex } from './Components/Helpers/random';

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
