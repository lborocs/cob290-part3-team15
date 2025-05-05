import React, { useState } from 'react';
import TaskCard from './TaskCard';

function TasksList({ tasks }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dueDateFilter, setDueDateFilter] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date();

  const dueDateFilteredTasks = tasks.filter(task => {
    const dueDate = new Date(task.deadline);

    if (dueDateFilter === 'today') {
      return dueDate.toDateString() === today.toDateString();
    }
    if (dueDateFilter === 'week') {
      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= endOfWeek;
    }
    if (dueDateFilter === 'month') {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return dueDate >= today && dueDate <= endOfMonth;
    }
    return true; // 'any' filter
  });

  const statusFilteredTasks = dueDateFilteredTasks.filter(task => {
    const dueDate = new Date(task.deadline);

    if (statusFilter === 'completed') {
      return task.status === 'Completed';
    }
    if (statusFilter === 'overdue') {
      return dueDate < today && task.status !== 'Completed'; // Only show overdue tasks if incomplete
    }
    return true; // 'all' filter
  });

  const searchedTasks = statusFilteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...searchedTasks].sort((a, b) =>
    new Date(a.deadline) - new Date(b.deadline)
  );

  const handleDropdownChange = (event) => {
    setDueDateFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col p-6 bg-secondary/40 rounded-3xl col-span-2 row-span-4">
      <div className="flex flex-col items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tasks</h3>
        <div className="flex w-full">
          <p className={"px-2"}>Due Date</p>
          <select
            value={dueDateFilter}
            onChange={handleDropdownChange}
            className="flex-1 px-3 py-1 rounded-full text-sm capitalize bg-gray-200 text-gray-700"
          >
            <option value="any">Any</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>
        <div className="flex gap-2 mt-2 w-full">
          <p className={"px-2"}>Status</p>
          <button
              onClick={() => setStatusFilter(statusFilter==='completed' ? 'all' : 'completed')}
              className={`flex-1 px-3 py-1 rounded-full text-sm capitalize ${
                  statusFilter === 'completed' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            Completed
          </button>
          <button
              onClick={() => setStatusFilter(statusFilter==='overdue' ? 'all' : 'overdue')}
              className={`flex-1 px-3 py-1 rounded-full text-sm capitalize ${
                  statusFilter === 'overdue' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
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