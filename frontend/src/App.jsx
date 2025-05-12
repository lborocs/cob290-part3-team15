import {lazy} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import './axios.jsx'

//Page imports
const Login = lazy(() => import('./pages/Login'));
const PageDoesNotExist = lazy(() => import('./pages/PageDoesNotExist'));
const Chat = lazy(() => import('./pages/Chat'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/*2 Button page*/}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/*Our subsystems*/}
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/analytics" element={<Analytics/>}/>

        {/*Catch case, everything else goes to PageDoesNotExist.jsx*/}
        <Route path="*" element={<PageDoesNotExist/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
