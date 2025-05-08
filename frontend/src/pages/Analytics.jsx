import React, {use, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import {connectSocket, disconnectSocket, getSocket} from '../socket';
import axios from "axios";
import EmployeeQuickStatistics from "../components/analytics/EmployeeQuickStatistics.jsx";
import QuickStatistics from "../components/analytics/QuickStatistics.jsx";
import SearchBox from "../components/analytics/SearchBox.jsx";
import EmployeeStatisticsField from "../components/analytics/EmployeeStatisticsField.jsx";
import StatisticsField from "../components/analytics/StatisticsField.jsx";


function Analytics({ user }) {
    const navigate = useNavigate();
    const selectable = false;
    const [userRole, setUserRole] = useState(user.role);
    const activeTab = "Analytics";
    const [personalStatus, setPersonalStatus] = useState("Offline");
    const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // this will be for all projects a user is on
    const [projects, setProjects] = useState([]);
    // this will be for all projects a user is a team member of
    // we will use the size of the arry to determine if the user is a team leader
    const [ledProjects, setLedProjects] = useState([]);
    const [ledTasks, setLedTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [personalTasks, setPersonalTasks] = useState([]);


    // Fetch all project-side data to be displayed
    const fetchData = async() => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // all projects this user is on
            const responseProjects = await axios.get(`/api/analytics/projects/getProjects`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseProjects?.data?.projects.length > 0) {
                setProjects(responseProjects.data.projects);
            }

            // projects led by this user
            const responseLedProjects = await axios.get(`/api/analytics/projects/getProjectsByLeader`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseLedProjects?.data?.projects.length > 0) {
                setLedProjects(responseLedProjects.data.projects);
                // if the user is a team leader, set the selected project to the first led project
                console.log("Led projects:", responseLedProjects.data.projects);
            }

            // Get all employees/ all employees on led projects
            const responseEmployees = await axios.get(`/api/analytics/projects/getTeamMembers`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseEmployees?.data?.employees) {
                setEmployees(responseEmployees.data.employees);
                console.log("Employees:", responseEmployees.data.employees);    
            }

            // get all tasks all tasks on led projects if manager all projects
            const responseTasks = await axios.get(`/api/analytics/projects/getTasks`, {
                headers: { Authorization: `Bearer ${accessToken}` },        
            });

            if (responseTasks?.data?.tasks) {
                setLedTasks(responseTasks.data.tasks);
            }

            // get personal tasks for the employee side
            const responsePersonalTasks = await axios.get(`/api/analytics/employees/getUserTasks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responsePersonalTasks?.data?.results) {
                setPersonalTasks(responsePersonalTasks.data.results);
            }

        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [selectedProject, user]);

    useEffect(() => {
        connectSocket();
        const socket = getSocket();
        if (socket) {
            socket.on('selfStatus', (data) => {
                setPersonalStatus(data?.status);
            });
            socket.emit('requestStatus', user.userID);
        }
        return () => {
            socket.off('selfStatus');
            disconnectSocket();
        };
    }, [user.userID]);

    return (
        <div className="flex h-screen w-screen">
            <Navbar
                userID={user.userID}
                selectable={selectable}
                isSelected={null}
                setIsSelected={null}
                activeTab={activeTab}
                status={personalStatus}
            />
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 h-screen flex-1 w-full bg-primary overflow-y-auto lg:overflow-y-hidden overflow-x-hidden p-2 lg:p-0">
                <div className="ml-0 col-span-4 col-start-2 row-span-1 row-start-2 rounded-4xl p-2">
                    <h2 className="text-4xl font-bold text-start text-text">Welcome {user.name}</h2>
                    <h3 className='text-2xl text-start mt-0 '>{userRole}</h3>
                    { userRole !== "Manager" && ledProjects.length > 0 && (
                        <div className="flex items-center mt-4">
                            <div className="flex border-2 border-accentOrange rounded-full overflow-hidden">
                                <button
                                className={`px-4 py-2 transition-colors duration-200 ${
                                    userRole === "Employee" 
                                    ? 'bg-accentOrange text-white' 
                                    : 'bg-white text-gray-700 hover:bg-accentOrange/10'
                                }`}
                                onClick={() => setUserRole("Employee")}
                                >
                                Employee
                                </button>
                                <button
                                className={`px-4 py-2 transition-colors duration-200 ${
                                    userRole === "Team Leader" 
                                    ? 'bg-accentOrange text-white' 
                                    : 'bg-white text-gray-700 hover:bg-accentOrange/10'
                                }`}
                                onClick={() => setUserRole("Team Leader")}
                                >
                                Team Leader
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 lg:row-start-1 lg:col-start-6 w-full self-end text-start text-2xl font-bold test-text flex items-center justify-between">
                    <span className={"py-1 pr-2"}>{selectedProject.title}</span>
                    {selectedProject.title !== 'Overview' && (
                        <button
                            onClick={() => setSelectedProject({ title: 'Overview' })}
                            className="px-2 py-1 bg-[#6B7880]/30 text-white rounded-md hover:bg-secondary-dark"
                        >
                            Back to Overview
                        </button>
                    )}
                </div>

                {userRole === "Team Leader" || userRole === "Manager"? (
                    <>
                        <QuickStatistics
                            userRole={userRole}
                            selectedProjectId={selectedProjectId}
                        />

                        <SearchBox
                            onProjectSelect={setSelectedProjectId}
                        />

                        <StatisticsField
                            selectedProjectId={selectedProjectId}
                        />
                    </>
                ) : (
                    <>
                        <QuickStatistics
                            userRole={userRole}
                            selectedProjectId={selectedProjectId}
                        />

                        <SearchBox
                            onProjectSelect={setSelectedProject}
                        />

                        <EmployeeStatisticsField
                            selectedProject={selectedProject}
                            tasks={personalTasks}
                            employees={employees}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default Auth(Analytics);