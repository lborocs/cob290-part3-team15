import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Teamleader from './Analytics/Teamleader';
import Employee from './Analytics/Employee';
import Manager from './Analytics/Manager';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import { connectSocket, disconnectSocket,getSocket } from '../socket';
import axios from "axios";



function AnalyticsLanding({ user }) {
    const navigate = useNavigate();
    const userID = user.userID;
    const [isLeader, setIsLeader] = useState(false)
    const selectable = false
    const activeTab="Analytics"
    const [personalStatus, setPersonalStatus] = useState("Offline");

    // Check if the user leads any projects on page load
    useEffect(() => {

        // Define and then call async effect function WITHIN useEffect
        // Since useEffect has to return void so we need to discard the returned promise
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

  useEffect(() => {
      connectSocket();
      const socket = getSocket();
      // Setup listeners early, before any emit
      if (socket) {
          socket.on('selfStatus', (data) => {
            if (!data || Object.keys(data).length === 0) return;
            setPersonalStatus(data?.status);
          });
        socket.emit('requestStatus');
      }
      return () => {
          socket.off('selfStatus');
          disconnectSocket(); //Disconnects when not on /chat or /analytics
      };
  }, []);

    return (
      <div className="flex h-screen w-screen">
        <Navbar userID = {userID} selectable={selectable} isSelected={null} setIsSelected={null} activeTab={activeTab} status={personalStatus}/>
        {isLeader ? (
          <Teamleader user={user} roleLabel={"Employee/Leader"} />
        ) : user.role === "Employee" ? (
          <Employee user={user} roleLabel={"Employee"} />
        ) : user.role === "Manager" ? (
          <Manager user={user} roleLabel={"Manager"} />
        ) : (
          <div>No role assigned</div>
        )}
      </div>
    );
}

export default Auth(AnalyticsLanding)