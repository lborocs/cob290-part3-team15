import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import {connectSocket, disconnectSocket, getSocket} from '../socket';
import axios from "axios";
import QuickStatistics from "../components/analytics/QuickStatistics.jsx";
import SearchBox from "../components/analytics/SearchBox.jsx";
import StatisticsField from "../components/analytics/StatisticsField.jsx";

function Analytics({ user }) {
    const navigate = useNavigate();
    const selectable = false;
    const [userRole, setUserRole] = useState(user.role);
    const activeTab = "Analytics";
    const [personalStatus, setPersonalStatus] = useState("Offline");
    const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    // Fetch all project-side data to be displayed
    const fetchData = async() => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // Get all projects/ all led projects
            const responseProjects = await axios.get(`/api/analytics/projects/getProjects`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseProjects?.data?.projects.length > 0) {
                setProjects(responseProjects.data.projects);
            }

            // Get all employees/ all employees on led projects
            const responseEmployees = await axios.get(`/api/analytics/projects/getTeamMembers`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseEmployees?.data?.employees) {
                setEmployees(responseEmployees.data.employees);
            }

            // Get all tasks/ all tasks on led projects
            const responseTasks = await axios.get(`/api/analytics/projects/getTasks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (responseTasks?.data?.tasks) {
                setTasks(responseTasks.data.tasks);
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
                    <h5 className='text-start text-text font-bold cursor-pointer mt-2 w-1/2'
                        onClick={() => setUserRole("Employee")}
                    >
                        Go to your Employee dashboard
                    </h5>
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

                <QuickStatistics
                    selectedProject={selectedProject}
                    projects={projects}
                    employees={employees}
                    tasks={tasks}
                />

                <SearchBox
                    projects={projects}
                    onProjectSelect={setSelectedProject}
                    selectedProject={selectedProject}
                />

                <StatisticsField
                    selectedProject={selectedProject}
                    tasks={tasks}
                    employees={employees}
                />
            </div>
        </div>
    )
    
}

export default Auth(Analytics);