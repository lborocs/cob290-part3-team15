import StatisticsFieldCarousel from "./StatisticsFieldCarousel.jsx";
import TasksList from "./TasksList.jsx";
import StatisticsFieldBottom from "./StatisticsFieldBottom.jsx";
import React from "react";

function StatisticsField({selectedProject, tasks, employees}) {

    if (selectedProject.title === "Overview") {
        return (
            <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 flex flex-col justify-center bg-secondary/50 rounded-3xl w-full ">
                <p>Select a project/employee to view details</p>
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