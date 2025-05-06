import React from 'react'
import QuickStatisticItem from "./QuickStatisticItem.jsx";

function QuickStatistics({ selectedProject, projects, employees, tasks }) {

    // Build the quick statistics
    let statsArr = [];

    if (selectedProject.title === "Overview") {
        // project count statistic
        const projectCount = projects.length;
        const projectCountStat = {
            id: 'overview-projects',
            title: 'Projects',
            value: projectCount,
        };
        statsArr.push(projectCountStat);

        // employee count statistic
        const employeeCountStat = {
            id: 'overview-employees',
            title: 'Employees',
            value: employees.length,
        };
        statsArr.push(employeeCountStat);

        // task count statistic
        const taskCount = tasks.length;
        const taskCountStat = {
            id: 'overview-tasks',
            title: 'Tasks',
            value: taskCount,
        };
        statsArr.push(taskCountStat);
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