import React, {useEffect, useState} from 'react'
import QuickStatisticItem from "./QuickStatisticItem.jsx";
import axios from "axios";

function QuickStatistics({ userRole, selectedProjectId }) {

    const [stats, setStats] = useState([]);

    // Get stats for the project overview
    const fetchProjectOverviewStats = async() => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await axios.get(`/api/analytics/projects/getOverviewQuickStatistics`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setStats(
                [
                    {
                        id: 'overview-projects',
                        title: 'Projects',
                        value: response.data.results[0].projects,
                    },
                    {
                        id: 'overview-employees',
                        title: 'Employees',
                        value: response.data.results[0].employees,
                    },
                    {
                        id: 'overview-tasks',
                        title: 'All Tasks',
                        value: response.data.results[0].tasks,
                    }
                ]
            );
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Get stats for a selected project on the project side
    const fetchProjectStats = async() => {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get(`/api/analytics/projects/getQuickStatistics?projectId=${selectedProjectId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        setStats(
            [
                {
                    id: `project-tasks`,
                    title: 'Tasks',
                    value: response.data.results[0].tasks,
                },
                {
                    id: 'project-task-completion',
                    title: 'Tasks Completed',
                    value: response.data.results[0].completed,
                },
                {
                    id: 'project-overdue-tasks',
                    title: 'Overdue Tasks',
                    value: response.data.results[0].overdue,
                }
            ]
        );
    }

    // Get stats for the employee overview
    const fetchEmployeeOverviewStats = async() => {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get(`/api/analytics/employees/getOverviewQuickStatistics`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        setStats(
            [
                {
                    id: 'overview-projects',
                    title: 'Assigned Projects',
                    value: response.data.results[0].projects,
                },
                {
                    id: 'overview-tasks',
                    title: 'Assigned Tasks',
                    value: response.data.results[0].tasks,
                },
                {
                    id: 'overdue-tasks',
                    title: 'Tasks Overdue',
                    value: response.data.results[0].overdue,
                }
            ]
        )
    }

    // Get stats for a selected project on the employee side
    const fetchEmployeeProjectStats = async() => {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get(`/api/analytics/employees/getQuickStatistics?projectId=${selectedProjectId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        setStats(
            [
                {
                    id: 'project-tasks',
                    title: 'Tasks',
                    value: response.data.results[0].tasks,
                },
                {
                    id: 'project-completed',
                    title: 'Tasks Completed',
                    value: response.data.results[0].completed,
                },
                {
                    id: 'project-overdue',
                    title: 'Tasks Overdue',
                    value: response.data.results[0].overdue,
                }
            ]
        )
    }

    useEffect(() => {
        if (userRole === 'Employee') {
            selectedProjectId ? fetchEmployeeProjectStats() : fetchEmployeeOverviewStats();
        }
        else {
            selectedProjectId ? fetchProjectStats() : fetchProjectOverviewStats();
        }
    }, [selectedProjectId, userRole]);

    return (
        <div className="col-start-2 row-start-3 col-span-4 w-full">
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                {stats.map((stat) => (
                    <QuickStatisticItem
                        key={stat.id}
                        title={stat.title}
                        statisticValue={stat.value}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuickStatistics;