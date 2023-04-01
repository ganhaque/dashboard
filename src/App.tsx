import React from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import Main from './Components/Main';
import SideBar from './Components/Modules/Sidebar/SideBar';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      {/* <div className="flex"> */}
      <SideBar />
      <Main />
      {/* </div> */}
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
      {/* </header> */}
    </div>
  );
}

export default App;
