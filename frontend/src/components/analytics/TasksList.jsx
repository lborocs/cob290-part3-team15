import React, { useState } from 'react';
import TaskCard from './TaskCard';

function TasksList() {
  const [tasks] = useState([
    { id: 1, title: 'Create tasks component', dueDate: '2025-03-31', priority: 'high', project: 'Add extra info' },
    { id: 2, title: 'Add to tasks component', dueDate: '2025-04-16', priority: 'high', project: 'Add extra info' },
    { id: 3, title: 'Add a filter', dueDate: '2025-04-18', priority: 'medium', project: 'Add extra info' },
    { id: 4, title: 'Filter by priority', dueDate: '2025-04-20', priority: 'low', project: 'Add extra info' },
    { id: 5, title: 'Todo employee page', dueDate: '2025-05-22', priority: 'medium', project: 'Add extra info' },
    { id: 6, title: 'wewee', dueDate: '2025-05-20', priority: 'medium', project: 'Add extra info' },
    { id: 7, title: 'Fwqhwe', dueDate: '2025-05-20', priority: 'low', project: 'Add extra info' },
    { id: 8, title: 'wawwaw', dueDate: '2025-05-20', priority: 'medium', project: 'Add extra info' },
  ]);

  const [filter, setFilter] = useState('today');
  const today = new Date();

  const filteredTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    
    if (filter === 'today') {
      return dueDate.toDateString() === today.toDateString();
    }
    if (filter === 'week') {
      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= endOfWeek;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  

  return (
    <div className='flex flex-col p-6 bg-secondary/40 rounded-3xl col-span-2 row-span-4'>
      <div className="flex flex-col items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Tasks</h3>
        <div className="flex gap-1">
          {['today', 'week', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === f ? 'bg-accentOrange text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'today' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-grow pb-1 scroll-pb-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard task={task}/>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No tasks found</p>
        )}
      </div>
    </div>
  );
}

export default TasksList;