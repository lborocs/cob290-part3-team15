import React from 'react'

function TaskCard( { task } ) {
    const priorityClasses = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800'
    };

    const isOverdue = new Date(task.deadline) < new Date();

    return (
        <div 
            key={task.id} 
            className={`p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isOverdue ? 'bg-red-50' : 'bg-white'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-start font-medium text-sm text-gray-900">{task.title}</h4>
                    <p className="text-start text-xs text-gray-600">{task.project}</p>
                </div>

                <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityClasses[task.priority]}`}>
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