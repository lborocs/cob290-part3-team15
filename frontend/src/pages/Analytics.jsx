import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import { connectSocket, disconnectSocket, getSocket } from '../socket';
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
    const activeTab = "Analytics";
    const [personalStatus, setPersonalStatus] = useState("Offline");

    const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });
    const [projects, setProjects] = useState([]);
    const [quickStatistics, setQuickStatistics] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (selectedProject.title === 'Overview') {
                    // this is a function for when the page is in overview mode
                    let filter = "all";

                    if (user.role !== "Manager") {
                        filter = user.userID;
                    }

                    const response = await axios.get(`/api/analytics/getOverview?filter=${filter}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (response?.data?.projects) {
                        setProjects(response.data.projects);

                        const projectCount = response.data.projects.length;
                        const projectCountStat = {
                            id: 'overview-projects',
                            title: 'Projects',
                            value: projectCount,
                        };
                        setQuickStatistics([projectCountStat]);
                    }

                    if (response?.data?.employees) {
                        // remove duplicates from the employees array
                        const uniqueEmployees = response.data.employees.filter((employee, index, self) =>
                            index === self.findIndex((e) => (
                                e.id === employee.id
                            ))
                        );
                        setEmployees(uniqueEmployees);

                        // employee count statistic
                        const employeeCount = response.data.employees.length;
                        const employeeCountStat = {
                            id: 'overview-employees',
                            title: 'Employees',
                            value: employeeCount,
                        };
                        setQuickStatistics((prevStats) => [...prevStats, employeeCountStat]);
                    }

                    if (response?.data?.tasks) {
                        // remove duplicates from the tasks array
                        const uniqueTasks = response.data.tasks.filter((task, index, self) =>
                            index === self.findIndex((t) => (
                                t.id === task.id
                            ))
                        );
                        setTasks(uniqueTasks);

                        // task count statistic
                        const taskCount = response.data.tasks.length;
                        const taskCountStat = {
                            id: 'overview-tasks',
                            title: 'Tasks',
                            value: taskCount,
                        };
                        setQuickStatistics((prevStats) => [...prevStats, taskCountStat]);
                    }
                } else {
                    // we get just the selected project
                    const response = await axios.get(`/api/analytics/getProjectDetails?title=${selectedProject.title}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (response?.data) {
                        const projectDetails = response.data.project;

                        const projectEmployees = response.data.employees;
                        setEmployees(projectEmployees);

                        const projectTasks = response.data.tasks;

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
            <Navbar
                userID={user.userID}
                selectable={selectable}
                isSelected={null}
                setIsSelected={null}
                activeTab={activeTab}
                status={personalStatus}
            />
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 h-screen flex-1 w-full bg-primary overflow-y-auto lg:overflow-y-hidden overflow-x-hidden p-2 lg:p-0">
                <WelcomeMessage userName={user.name} roleLabel={roleLabel} />

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
                    onProjectSelect={handleProjectSelect}
                    selectedProject={selectedProject}
                />

                <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
                    <>
                        <StatisticsFieldCarousel />
                        <TasksList tasks={ tasks }/>
                        <StatisticsFieldBottom employees={ employees }/>
                    </>
                </div>
            </div>
        </div>
    );
}

export default Auth(Analytics);