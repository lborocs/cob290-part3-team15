import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Teamleader from './Analytics/Teamleader';
import Employee from './Analytics/Employee';
import Manager from './Analytics/Manager';
import Auth from "../components/login/Auth.jsx";
import axios from "axios";


function AnalyticsLanding({ user }) {
    const navigate = useNavigate();

    const [isLeader, setIsLeader] = useState(false)

    // Check if the user leads any projects on page load
    useEffect(() => {
        async function fetchLeader() {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.get(`/api/analytics/getLedProjects`, {headers: { Authorization: `Bearer ${accessToken}` }});
                if (response?.data?.results) {
                    // Set role to team leader if the user leads any projects
                    if (response.data.results.length !== 0) {
                        setIsLeader(true)
                    }
                }
            }
            catch (error) {
                // Empty as we log errors in the request response
            }
            }
        fetchLeader();
    }, []
);

    return (
        // TODO: Consider merging these into one page component and use state to change contents
        <>
            {isLeader && <Teamleader user={user} roleLabel={"Employee/Leader"}/>}
            {user.role === "Employee" && <Employee user={user} roleLabel={"Employee"}/>}
            {user.role === "Manager" && <Manager user={user} roleLabel={"Manager"}/>}
        </>
    );
}

export default Auth(AnalyticsLanding)