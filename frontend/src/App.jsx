import { lazy } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';

//Page imports
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const PageDoesNotExist = lazy(() => import('./pages/PageDoesNotExist'));
const Chat = lazy(() => import('./pages/Chat'));
const AnalyticsLanding = lazy(() => import('./pages/Analytics'));


// Analytics subsystem imports
const Employee = lazy(() => import('./pages/Analytics/Employee'));
const Teamleader = lazy(() => import('./pages/Analytics/Teamleader'));
const Manager = lazy(() => import('./pages/Analytics/Manager'));

const Playground = lazy(() => import('./pages/Playground'));


function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/*2 Button page*/}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing/>}/>
        {/*Our subsystems (Import page and replace the <Landing/> part)*/}
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/data" element={<Landing/>}/>
        <Route path="/analytics" element={<AnalyticsLanding/>}/>

        {/*Routes for the different analytic modes (could change to be just one)*/}
        <Route path="/analytics/employee" element={<Employee/>}/>
        <Route path="/analytics/leader" element={<Teamleader/>}/>
        <Route path="/analytics/manager" element={<Manager/>}/>

        {/*Extra*/}
        <Route path="/playground" element={<Playground/>}/>

        {/*Catch case, everything else goes to PageDoesNotExist.jsx*/}
        <Route path="*" element={<PageDoesNotExist/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
