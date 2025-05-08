import React from 'react'
import QuickStatisticItem from "./QuickStatisticItem.jsx";

// !! this component is currently unused
function QuickStatistics({ selectedProject, projects, tasks }) {

    // Build the quick statistics
    let statsArr = [];

    if (selectedProject.title === "Overview") {
        // project count statistic
        const projectCount = projects.length;
        const projectCountStat = {
            id: 'overview-projects',
            title: 'Assigned Projects',
            value: projectCount,
        };
        statsArr.push(projectCountStat); 
        
        // task count statistic
        const taskCount = tasks.length;
        const taskCountStat = {
            id: 'overview-tasks',
            title: 'Assigned Tasks',
            value: taskCount,
        };
        statsArr.push(taskCountStat);

        // task overdue statistic
        const taskOverview = tasks.filter(task => task.status === 'In Progress' || task.status === 'Completed').length;
        const taskOverviewStat = {
            id: 'overdue-tasks',
            title: 'Tasks Overdue',
            value: taskOverview,
        };
        statsArr.push(taskOverviewStat);

    }
    else {
        const projectTasks = tasks.filter(task => task.project === selectedProject.id);
        // project task count statistic
        const taskCount = projectTasks.length;
        const taskCountStat = {
            id: `project-${selectedProject.title}-tasks`,
            title: 'Tasks Total',
            value: taskCount,
        };
        statsArr.push(taskCountStat);

        // project completion percentage statistic
        const completedTasks = projectTasks.filter(task => task.status === 'Completed').length;
        let taskCompletionPercentage = Math.round((completedTasks / taskCount) * 100).toString();
        const taskCompletionStat = {
            id: `project-${selectedProject.title}-task-completion`,
            title: 'Task Completion',
            value: taskCompletionPercentage + '%',
        };
        statsArr.push(taskCompletionStat);

        // project overdue count statistic
        const overdueTasks = projectTasks.filter(task => task.dueDate < new Date()).length;
        const overdueTasksStat = {
            id: `project-${selectedProject.title}-overdue-tasks`,
            title: 'Overdue Tasks',
            value: overdueTasks,
        };
        statsArr.push(overdueTasksStat);
    }


    return (
        <div className="col-start-2 row-start-3 col-span-4 w-full">
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                {statsArr.map((stat) => (
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