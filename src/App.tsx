import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Components/Main';
import Quests from './Components/Modules/Quest';
import Time from './Components/Modules/Time';
import Weather from './Components/Modules/Weather';
import SideBar from './Components/Modules/Sidebar/SideBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="flex">
          <SideBar />
        </div>
        {/*   <img src={logo} className="App-logo" alt="logo" /> */}
        {/*   <p> */}
        {/*     Edit <code>src/App.tsx</code> and save to reload. */}
        {/*   </p> */}
        {/*   <a */}
        {/*     className="App-link" */}
        {/*     href="https://reactjs.org" */}
        {/*     target="_blank" */}
        {/*     rel="noopener noreferrer" */}
        {/*   > */}
        {/*     Learn React */}
        {/*   </a> */}
        <h2>
          Hello
        </h2>
        <Quests />
        <Time />
        <Weather />
        <Main />
      </header>
    </div>
  );
}

export default App;
