import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SideBar from './Components/Sidebar/SideBar';
import { sidebarItems } from './Components/Sidebar/SideBar';
import MainPage from './Components/MainPage';
import { colorPalettes, handleColorChange } from './Components/ColorPalette';
import { getRandomIndex } from './Components/Helpers/random';

const App = () => {
  /* const [activeItem, setActiveItem] = useState('home'); */
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(getRandomIndex(Object.keys(colorPalettes).length));
  /* const pageOrder = ['home', 'lightning', 'finance', 'calendar', 'add']; // define the order of pages here */
  /* const currentPageIndex = useRef(pageOrder.indexOf(activeItem)); // use a ref to keep track of the current page index */

  const handleSidebarItemClick = (itemIndex: number) => {
    /* console.log(itemIndex); */
    if (itemIndex === sidebarItems.length - 1) { // The last item is the 'Themes' item
      const numPalettes = Object.keys(colorPalettes).length;
      const nextIndex = (colorPaletteIndex + 1) % numPalettes;
      setColorPaletteIndex(nextIndex);
      /* console.log("change color"); */
    }
    else {
      setActiveItemIndex(itemIndex);
      /* currentPageIndex.current = pageOrder.indexOf(itemIndex); // update the current page index */
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        // go to the previous page
        setActiveItemIndex((activeItemIndex + sidebarItems.length - 2) % (sidebarItems.length - 1));
      } else {
        // go to the next page
        setActiveItemIndex((activeItemIndex + 1) % (sidebarItems.length - 1));
      }
    }
  };

  useEffect(() => {
    const paletteNames = Object.keys(colorPalettes);
    const currentPaletteName = paletteNames[colorPaletteIndex];
    handleColorChange(currentPaletteName);
  }, [colorPaletteIndex]);

  useEffect(() => {
    // add event listener for Tab and Shift-Tab keys
    document.addEventListener('keydown', handleKeyDown);

    // remove event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [activeItemIndex]);

  return (
    <div className="App flex-container">
      <SideBar activeItem={activeItemIndex} onItemClick={handleSidebarItemClick} />
      <MainPage activeItemIndex={activeItemIndex} />
    </div>
  );
};

export default App;

