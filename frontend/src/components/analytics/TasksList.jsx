import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { FiSearch, FiCalendar } from 'react-icons/fi';

function TasksList({ tasks }) {
  const [statusFilter, setStatusFilter] = useState('all');
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
      return dueDate < today && task.status !== 'Completed';
    }
    return true; // 'all' filter
  });

  const searchedTasks = statusFilteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...searchedTasks].sort((a, b) =>
    new Date(a.deadline) - new Date(b.deadline)
  );
  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 col-span-2 row-span-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Tasks</h3>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-accentOrange focus:ring-1 focus:ring-accentOrange"
          />
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <span>Filter tasks</span>
          </div>

          <div className="relative w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-accentOrange focus:border-transparent appearance-none bg-white text-sm"
            >
              <option value="any">Any Date</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
            className={`flex items-center justify-center rounded-lg text-sm font-medium transition-colors w-full ${
              statusFilter === 'completed' ? 'bg-green-100 text-green-800'  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
            className={`flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-colors w-full ${
              statusFilter === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow pb-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <FiSearch className="text-3xl mb-2" />
            <p>No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksList;