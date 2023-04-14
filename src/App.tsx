import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SideBar from './Components/Sidebar/SideBar';
import MainPage from './Components/MainPage';
import { colorPalettes, handleColorChange } from './Components/ColorPalette';
import { getRandomIndex } from './Components/Helpers/random';

const App = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [colorPaletteIndex, setColorPaletteIndex] = useState(getRandomIndex(Object.keys(colorPalettes).length));
  const pageOrder = ['home', 'lightning', 'finance', 'calendar', 'add']; // define the order of pages here
  const currentPageIndex = useRef(pageOrder.indexOf(activeItem)); // use a ref to keep track of the current page index

  const handleSidebarItemClick = (itemIndex: string) => {
    if (itemIndex === 'themes') {
      const numPalettes = Object.keys(colorPalettes).length;
      const nextIndex = (colorPaletteIndex + 1) % numPalettes;
      setColorPaletteIndex(nextIndex);
    } else {
      setActiveItem(itemIndex);
      currentPageIndex.current = pageOrder.indexOf(itemIndex); // update the current page index
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        // go to the previous page
        currentPageIndex.current =
          (currentPageIndex.current - 1 + pageOrder.length) % pageOrder.length;
      } else {
        // go to the next page
        currentPageIndex.current = (currentPageIndex.current + 1) % pageOrder.length;
      }
      setActiveItem(pageOrder[currentPageIndex.current]); // set the active page
    }
  };

  useEffect(() => {
    const paletteNames = Object.keys(colorPalettes);
    const currentPaletteName = paletteNames[colorPaletteIndex];
    handleColorChange(currentPaletteName);
    document.addEventListener('keydown', handleKeyDown); // add the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // remove the event listener on unmount
    };
  }, [colorPaletteIndex]);

  return (
    <div className="App flex-container">
      <SideBar activeItem={activeItem} onItemClick={handleSidebarItemClick} />
      <MainPage activeItem={activeItem} />
    </div>
  );
};

export default App;

