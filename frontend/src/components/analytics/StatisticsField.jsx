import ProjectGraphCarousel from "./ProjectGraphCarousel.jsx";
import TasksList from "./TasksList.jsx";
import ProjectMemberList from "./ProjectMemberList.jsx";
import React from "react";
import EmployeeWorkStatistics from "./EmployeeWorkStatistics.jsx";
import EmployeeGraphCarousel from "./EmployeeGraphCarousel.jsx";

function StatisticsField({ userRole, selectedProjectId }) {

    // get employees on this project or all projects led by this user

    return (
        <div className="lg:col-start-6 lg:row-start-2 lg:col-span-6 lg:row-span-5 rounded-3xl lg:grid lg:grid-cols-6 lg:grid-rows-4 flex flex-col gap-4 w-full">
            {userRole === "Employee" ? (
                <>
                <EmployeeGraphCarousel selectedProjectId={selectedProjectId} />
                <TasksList selectedProjectId={selectedProjectId} role={userRole} />
                <EmployeeWorkStatistics selectedProjectId={selectedProjectId} />
                </>
            ) : userRole === "Manager" ? (
                selectedProjectId ? (
                    <>
                        <ProjectGraphCarousel selectedProjectId={selectedProjectId} />
                        <TasksList selectedProjectId={selectedProjectId} role={userRole} />
                        <ProjectMemberList selectedProjectId={selectedProjectId} />
                    </>
                ) : (
                    <>
                    <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                        <p className="text-3xl text-center">Select a project to view details</p>
                    </div>
                    <TasksList selectedProjectId={selectedProjectId} role={userRole} />
                    <ProjectMemberList selectedProjectId={selectedProjectId} />
                    </>
                    
                )
            ) : userRole === "Team Leader" ? (
                selectedProjectId ? (
                    <>
                        <ProjectGraphCarousel selectedProjectId={selectedProjectId} />
                        <TasksList selectedProjectId={selectedProjectId} role={userRole} />
                        <ProjectMemberList selectedProjectId={selectedProjectId} />
                    </>
                ) : (
                    <>
                    <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                        <p className="text-3xl text-center">Select a project to view details</p>
                    </div>
                    
                    <TasksList selectedProjectId={selectedProjectId} role={userRole} />
                    <ProjectMemberList selectedProjectId={selectedProjectId} />
                    </>

                )
            ) : (
                <div className="flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 w-full">
                    <p className="text-3xl text-center">Role not recognized</p>
                </div>
            )}
        </div>
    );
}

export default StatisticsField;