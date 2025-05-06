import StatisticsFieldCarousel from "./StatisticsFieldCarousel.jsx";
import TasksList from "./TasksList.jsx";
import StatisticsFieldBottom from "./StatisticsFieldBottom.jsx";
import React from "react";

function StatisticsField({selectedProject, tasks, employees}) {

    if (selectedProject.title === "Overview") {
        return (
            <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
                <>
                    <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                    <p className="text-3xl text-center">Select a project to view details</p>
                    </div>
                    
                    <TasksList tasks={ tasks }/>
                    <StatisticsFieldBottom employees={ employees }/>
                </>
            </div>
        );
    }
    else {
        return (
            <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
                <>
                    <StatisticsFieldCarousel project={ selectedProject }/>
                    <TasksList tasks={ tasks }/>
                    <StatisticsFieldBottom employees={ employees }/>
                </>
            </div>
        );
    }
}

export default StatisticsField;