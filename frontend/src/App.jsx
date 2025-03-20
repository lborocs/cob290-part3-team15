import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

//Page imports
import Landing from './pages/Landing';
import PageDoesNotExist from './pages/PageDoesNotExist';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';

// Analytics subsystem imports
import Employee from './pages/Analytics/Employee';
import Teamleader from './pages/Analytics/Teamleader';
import Manager from './pages/Analytics/Manager';

import Playground from './pages/Playground';

function App() {
  return (
    <>
    <Routes>
      {/*2 Button page*/}
      <Route path="/" element={<Landing/>}/>
      {/*Our subsystems (Import page and replace the <Landing/> part)*/}
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/data" element={<Landing/>}/>
      <Route path="/analytics" element={<Analytics/>}/>

      {/*Routes for the different analytic modes (could change to be just one)*/}
      <Route path="/analytics/employee" element={<Employee/>}/>
      <Route path="/analytics/leader" element={<Teamleader/>}/>
      <Route path="/analytics/manager" element={<Manager/>}/>

      {/*Extra*/}
      <Route path="/playground" element={<Playground/>}/>

      {/*Catch case, everything else goes to PageDoesNotExist.jsx*/}
      <Route path="*" element={<PageDoesNotExist/>}/>
    </Routes>
    </>
  )
}

function WrappedApp(){
  return(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  )
}

export default WrappedApp
