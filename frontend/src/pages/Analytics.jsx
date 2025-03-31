import React from 'react'
import { useNavigate } from 'react-router-dom';
import Teamleader from './Analytics/Teamleader';
import Employee from './Analytics/Employee';
import Manager from './Analytics/Manager';  


function AnalyticsLanding() {
    const navigate = useNavigate();
    const userRole = "team leader"; // Replace this with actual logic to determine the user's role
    const userID = 1; // Replace this with actual logic to determine the user's id or could be their email or name

    return (
        <>
            {userRole === "team leader" && <Teamleader />}
            {userRole === "employee" && <Employee />}
            {userRole === "manager" && <Manager />}
        </>
    );
}

export default AnalyticsLanding