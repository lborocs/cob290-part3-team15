import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import { connectSocket, disconnectSocket,getSocket } from '../socket';
import axios from "axios";
import WelcomeMessage from "../components/analytics/WelcomeMessage.jsx";
import QuickStatistics from "../components/analytics/QuickStatistics.jsx";
import SearchBox from "../components/analytics/SearchBox.jsx";
import StatisticsFieldCarousel from "../components/analytics/StatisticsFieldCarousel.jsx";
import TasksList from "../components/analytics/TasksList.jsx";
import StatisticsFieldBottom from "../components/analytics/StatisticsFieldBottom.jsx";



function Analytics({ user }) {
    const navigate = useNavigate();
    const [roleLabel, setRoleLabel] = useState("Employee");
    const selectable = false;
    const activeTab="Analytics";
    const [personalStatus, setPersonalStatus] = useState("Offline");

    const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });

    const [projects, setProjects] = useState([
        { id: 1, title: 'Project Alpha', description: 'A project focused on alpha testing new features.' }
    ]);

    const [statistics, setStatistics] = useState([
        { id: 1, title: 'Statistic 1', value: '42', description: 'This is the first statistic.' },
        { id: 2, title: 'Statistic 2', value: '73%', description: 'This is the second statistic.' },
        { id: 3, title: 'Statistic 3', value: '120', description: 'This is the third statistic.' },
    ]);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    useEffect(() => {


        async function analyticsOnLoad() {

            try {
                const accessToken = localStorage.getItem('accessToken');

                // Check if the user leads any projects on page load
                let response = await axios.get(`/api/analytics/getUserLedProjects?target=${user.userID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
                if (response?.data?.results) {
                    // Set role to team leader if the user leads any projects
                    if (response.data.results.length !== 0) {
                        setRoleLabel("Employee/Leader");
                    }
                    else {
                        setRoleLabel(user.role);
                    }
                }



                // Get projects on page load
                let filter = "all"

                if (user.role !== "Manager") {
                    filter = user.userID;
                }

                response = await axios.get(`/api/analytics/getProjects?filter=${filter}`, {headers: { Authorization: `Bearer ${accessToken}` }});
                if (response?.data?.results) {
                    setProjects(response.data.results);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        analyticsOnLoad();

        // TODO: Remove below test function once actual stats are implemented
        // Test function to demonstrate working user and project contribution API requests
        async function fetchContribution() {
            try {
                const accessToken = localStorage.getItem('accessToken');

                let userHourArr = [];
                let projectHourArr = [];
                let scopeHourArr = [];

                // Get tasks assigned to user
                const tasksResponse = await axios.get(`/api/analytics/getUserTasks?target=${user.userID}`, {headers: { Authorization: `Bearer ${accessToken}` }});

                // Get user, project, scope hours in the past 4 weeks
                for (let weeksAgo=3; weeksAgo>=0; weeksAgo--) {
                    const userResponse = await axios.get(`/api/analytics/getUserWeeklyHours?target=${user.userID}&week=${weeksAgo}`, {headers: { Authorization: `Bearer ${accessToken}` }});
                    if (userResponse?.data?.results) {
                        userHourArr.push(userResponse.data.results[0].hours)
                    }
                    const projectResponse = await axios.get(`/api/analytics/getProjectWeeklyHours?target=1&week=${weeksAgo}`, {headers: { Authorization: `Bearer ${accessToken}` }});
                    if (projectResponse?.data?.results) {
                        projectHourArr.push(projectResponse.data.results[0].hours)
                    }
                    const scopeResponse = await axios.get(`/api/analytics/getProjectWeeklyScope?target=1&week=${weeksAgo}`, {headers: { Authorization: `Bearer ${accessToken}` }});
                    if (scopeResponse?.data?.results) {
                        scopeHourArr.push(scopeResponse.data.results[0].hours)
                    }
                }

                if (tasksResponse?.data?.results) {
                    console.log("User tasks");
                    console.log(tasksResponse.data.results);
                }
                console.log("User hours");
                console.log(userHourArr);
                console.log("Project hours");
                console.log(projectHourArr);
                console.log("Scope hours");
                console.log(scopeHourArr);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchContribution();

        connectSocket();
        const socket = getSocket();
        // Setup listeners early, before any emit
        if (socket) {
            socket.on('selfStatus', (data) => {
              setPersonalStatus(data?.status);
            });
            socket.emit('requestStatus', user.userID);
        }
        return () => {
            socket.off('selfStatus');
            disconnectSocket(); //Disconnects when not on /chat or /analytics
        };
    }, []);

    return (
      <div className="flex h-screen w-screen">
        <Navbar userID = {user.userID} selectable={selectable} isSelected={null} setIsSelected={null} activeTab={activeTab} status={personalStatus}/>
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 h-screen flex-1 w-full bg-primary overflow-y-auto lg:overflow-y-hidden overflow-x-hidden p-2 lg:p-0">
              <WelcomeMessage
                  userName={user.name}
                  roleLabel={roleLabel}
              />

              <div className="lg:col-span-4 lg:row-start-1 lg:col-start-6 w-full self-end text-start text-2xl font-bold test-text flex items-center justify-between">
                  <span>{selectedProject.title}</span>
                  {selectedProject.title !== 'Overview' && (
                      <button
                          onClick={() => setSelectedProject({ title: 'Overview' })}
                          className="px-2 py-1 bg-[#6B7880]/30 text-white rounded-md hover:bg-secondary-dark"
                      >
                          Back to Overview
                      </button>
                  )}
              </div>

              <div className="col-start-2 row-start-3 col-span-4 w-full">
                  <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                      {statistics.map(stat => (
                          <QuickStatistics
                              key={stat.id}
                              title={stat.title}
                              statisticValue={stat.value}
                          />
                      ))}
                  </div>
              </div>

              <SearchBox
                  projects={projects}
                  onProjectSelect={handleProjectSelect}
              />

              <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
                {/*Is this hacky? Absolutely, does it make more sense on mobile to see tasks first? Absolutely. */}
                <>
                    <StatisticsFieldCarousel />
                    <TasksList />
                    <StatisticsFieldBottom />
                </>
              </div>
          </div>
      </div>
    );
}

export default Auth(Analytics)