import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

//Page imports
import Landing from './pages/Landing';
import PageDoesNotExist from './pages/PageDoesNotExist';
import Chat from './pages/Chat';

function App() {
  return (
    <>
    <Routes>
      {/*2 Button page*/}
      <Route path="/" element={<Landing/>}/>
      {/*Our subsystems (Import page and replace the <Landing/> part)*/}
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/data" element={<Landing/>}/>

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
