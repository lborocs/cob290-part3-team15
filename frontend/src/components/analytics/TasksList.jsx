import React, { useState } from 'react';
import TaskCard from './TaskCard';

function TasksList({ tasks }) {
  const [filter, setFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date();

  const filteredTasks = tasks.filter(task => {
    const dueDate = new Date(task.deadline);

    if (filter === 'today') {
      return dueDate.toDateString() === today.toDateString();
    }
    if (filter === 'week') {
      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= endOfWeek;
    }
    if (filter === 'month') {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return dueDate >= today && dueDate <= endOfMonth;
    }
    if (filter === 'completed') {
      return task.completed;
    }
    if (filter === 'overdue') {
      return dueDate < today && !task.completed;
    }
    return true; // 'all' filter
  });

  const searchedTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...searchedTasks].sort((a, b) =>
    new Date(a.deadline) - new Date(b.deadline)
  );

  const handleDropdownChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col p-6 bg-secondary/40 rounded-3xl col-span-2 row-span-4">
      <div className="flex flex-col items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Tasks</h3>
        <div className="flex gap-2 w-full">
          <select
            value={filter}
            onChange={handleDropdownChange}
            className="flex-1 px-3 py-1 rounded-full text-sm capitalize bg-gray-200 text-gray-700"
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1 rounded-full text-sm capitalize ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`flex-1 px-3 py-1 rounded-full text-sm capitalize ${
              filter === 'overdue' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Overdue
          </button>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a task"
          className="mt-4 w-full px-3 py-2 rounded-full text-sm bg-gray-200 text-gray-700"
        />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-grow pb-1 scroll-pb-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No tasks found</p>
        )}
      </div>
    </div>
  );
}

export default TasksList;