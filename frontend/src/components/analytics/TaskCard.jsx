import React from 'react'

function TaskCard( { task } ) {
    const priorityClasses = {
        High: 'text-red-800',
        Medium: 'text-yellow-800',
        Low: 'text-green-800'
    };

    let bgColour = 'bg-white';
    if (task.status === 'Completed') {
        bgColour = 'bg-green-100';
    }
    else if (new Date(task.deadline) < new Date()) {
        bgColour = 'bg-red-100';
    }

    return (
        <div 
            key={task.id} 
            className={`p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${bgColour}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-start font-medium text-sm text-gray-900">{task.title}</h4>
                    <p className="text-start text-xs line-clamp-1 text-gray-600">{task.assigneeName}</p>
                </div>

                <div className="flex flex-col items-end">
                    <span className={`text-xs rounded-full ${priorityClasses[task.priority]}`}>
                        Priority: {task.priority}
                    </span>
                    <span className="text-end text-xs text-gray-600 mt-1">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TaskCard