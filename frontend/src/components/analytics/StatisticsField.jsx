import StatisticsFieldCarousel from "./StatisticsFieldCarousel.jsx";
import TasksList from "./TasksList.jsx";
import StatisticsFieldBottom from "./StatisticsFieldBottom.jsx";
import React from "react";

function StatisticsField({selectedProject, tasks, employees}) {

    const isOverview = selectedProject.title === "Overview";

    // Filter by tasks on this project
    const statsTasks = isOverview ? tasks : tasks.filter(task => task.project === selectedProject.id);

    // Filter by employees who have a task on this project or lead this project
    const statsEmployees = isOverview ? employees :
        employees.filter(employee =>
            tasks.some(task => task.assignee === employee.id && task.project === selectedProject.id)
            || selectedProject.leader === employee.id);

    return (
        <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
            <>
                {isOverview ?
                    <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                        <p className="text-3xl text-center">Select a project to view details</p>
                    </div>
                    :
                    <StatisticsFieldCarousel
                        selectedProject={ selectedProject }
                    />
                }
                <TasksList tasks={ statsTasks }/>
                <StatisticsFieldBottom employees={ statsEmployees }/>
            </>
        </div>
    );
}

export default StatisticsField;