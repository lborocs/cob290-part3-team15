import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import { connectSocket, disconnectSocket, getSocket } from '../socket';
import axios from "axios";
import WelcomeMessage from "../components/analytics/WelcomeMessage.jsx";
import QuickStatistics from "../components/analytics/QuickStatistics.jsx";
import SearchBox from "../components/analytics/SearchBox.jsx";
import StatisticsField from "../components/analytics/StatisticsField.jsx";

function Analytics({ user }) {
    const navigate = useNavigate();
    const selectable = false;
    const [UserRole, setUserRole] = useState(user.role);
    const activeTab = "Analytics";
    const [personalStatus, setPersonalStatus] = useState("Offline");
    const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });
    const [projects, setProjects] = useState([]);
    const [quickStatistics, setQuickStatistics] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (selectedProject.title === 'Overview') {
                    // TODO we shouldn't get all the data at once in the overview, just get the employees/projects and get the rest when needed
                    // this is a function for when the page is in overview mode
                    let filter = "all";

                    // If not a manager, filter queries for that employee
                    // and get the list of led projects
                    if (user.role !== "Manager") {
                        filter = user.userID;
                    }

                    const responseProjects = await axios.get(`/api/analytics/employees/getEmployeeProjects?filter=${filter}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    let statsArr = [];

                    if (responseProjects?.data?.projects) {
                        setProjects(responseProjects.data.projects);

                        const projectCount = responseProjects.data.projects.length;
                        const projectCountStat = {
                            id: 'overview-projects',
                            title: 'Projects',
                            value: projectCount,
                        };
                        statsArr.push(projectCountStat);
                    }

                    const responseEmployees = await axios.get(`/api/analytics/employees/getOverviewEmployees?filter=${filter}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    

                    if (responseEmployees?.data?.employees) {
                        // remove duplicates from the employees array
                        const uniqueEmployees = responseEmployees.data.employees.filter((employee, index, self) =>
                            index === self.findIndex((e) => (
                                e.id === employee.id
                            ))
                        );
                        setEmployees(uniqueEmployees);
                        
                        // if they have employees under them and they are not a manger, it is good to assume they are a Team leader
                        if (user.role !== "Manager" && responseEmployees?.data?.employees) {
                            setUserRole("Team Leader");
                        }

                        // employee count statistic
                        const employeeCountStat = {
                            id: 'overview-employees',
                            title: 'Employees',
                            value: uniqueEmployees.length,
                        };
                        statsArr.push(employeeCountStat);
                    }

                    const responseTasks = await axios.get(`/api/analytics/employees/getOverviewTasks?filter=${filter}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (responseTasks?.data?.tasks) {
                        // remove duplicates from the tasks array
                        const uniqueTasks = responseTasks.data.tasks.filter((task, index, self) =>
                            index === self.findIndex((t) => (
                                t.id === task.id
                            ))
                        );
                        setTasks(uniqueTasks);

                        // task count statistic
                        const taskCount = responseTasks.data.tasks.length;
                        const taskCountStat = {
                            id: 'overview-tasks',
                            title: 'Tasks',
                            value: taskCount,
                        };
                        statsArr.push(taskCountStat);
                    }

                    setQuickStatistics(statsArr);
                } else {
                    // or we get just the selected project

                    // get project details
                    const responseDetails = await axios.get(`/api/analytics/projects/getProjectDetails?id=${selectedProject.id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (responseDetails?.data) {
                        const projectDetails = responseDetails.data.project;
                        // TODO use this
                    }

                    // get project members
                    const responseMembers = await axios.get(`/api/analytics/projects/getProjectMembers?id=${selectedProject.id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (responseMembers?.data) {
                        const projectEmployees = responseMembers.data.employees;
                        console.log(projectEmployees)
                        setEmployees(projectEmployees);
                    }

                    // get project tasks
                    const responseTasks = await axios.get(`/api/analytics/projects/getProjectTasks?id=${selectedProject.id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (responseTasks?.data) {
                        const projectTasks = responseTasks.data.tasks;
                        setTasks(projectTasks);

                        // add statistics for the selected project
                        const taskCount = projectTasks.length;
                        const taskCountStat = {
                            id: `project-${selectedProject.title}-tasks`,
                            title: 'Tasks Total',
                            value: taskCount,
                        };

                        // another statistic showing the percentage of tasks completed
                        const completedTasks = projectTasks.filter(task => task.status === 'Completed').length;
                        let taskCompletionPercentage = Math.round((completedTasks / taskCount) * 100).toString();
                        const taskCompletionStat = {
                            id: `project-${selectedProject.title}-task-completion`,
                            title: 'Task Completion',
                            value: taskCompletionPercentage + '%',
                        };

                        setQuickStatistics([taskCountStat, taskCompletionStat]);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [selectedProject, user.role, user.userID]);

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
            {UserRole === "Team Leader" || UserRole === "Manager" ? (
                <>
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
                            <h3 className='text-2xl text-start mt-0 '>{UserRole}</h3>
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

                        <div className="col-start-2 row-start-3 col-span-4 w-full">
                            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                                {quickStatistics.map((stat) => (
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
                            onProjectSelect={setSelectedProject}
                            selectedProject={selectedProject}
                        />

                        <StatisticsField
                            selectedProject={selectedProject}
                            tasks={tasks}
                            employees={employees}
                        />
                    </div>
                </>
            ) : (
                <>
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
                            <h3 className='text-2xl text-start mt-0 '>{UserRole}</h3>
                            {projects.length > 1 && (
                                <h5 className='text-start text-text font-bold cursor-pointer mt-2 w-1/2'
                                    onClick={() => setUserRole("Team Leader")}
                                >
                                    Go to your Team Leader dashboard
                                </h5>
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

                        <div className="col-start-2 row-start-3 col-span-4 w-full">
                            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                                {quickStatistics.map((stat) => (
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
                            onProjectSelect={setSelectedProject}
                            selectedProject={selectedProject}
                        />

                        <StatisticsField
                            selectedProject={selectedProject}
                            tasks={tasks}
                            employees={employees}
                        />
                    </div>
                </>
            )}
        </div>
    )
    
}

export default Auth(Analytics);