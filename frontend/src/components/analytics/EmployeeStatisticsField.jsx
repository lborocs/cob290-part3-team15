import TasksList from "./TasksList.jsx";
import React from "react";
import EmployeeStatisticsFieldCarousel from "./EmployeeStatisticsFieldCarousel.jsx";
import StatisticsFieldBottom from "./StatisticsFieldBottom.jsx";

// TODO unused - remove
function EmployeeStatisticsField({selectedProject, personalTasks, employees}) {

    const isOverview = selectedProject.title === "Overview";

    // the single employee should just be the user
    const statsEmployees = isOverview ? employees :
        employees.filter(employee =>
            (personalTasks || []).some(task => task.assignee === employee.id && task.project === selectedProject.id)
            || selectedProject.leader === employee.id);
    // Filter by tasks on this project
    const statsTasks = isOverview ? (personalTasks || []) : (personalTasks || []).filter(task => task.project === selectedProject.id);



    return (
        <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
            <>
                {isOverview ?
                    <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                        <p className="text-3xl text-center">Select a project to view details</p>
                    </div>
                    :
                    <EmployeeStatisticsFieldCarousel
                        selectedProject={ selectedProject }
                    />
                }
                <TasksList
                    employees={ statsEmployees }
                    tasks={ statsTasks }
                />

                {/* need to think of something to add to this bottom section for now just a placeholder */}
                <StatisticsFieldBottom
                    employees={ [] }
                    tasks={ [] }
                />
                
            </>
        </div>
    );
}

export default EmployeeStatisticsField;