import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function EmployeeWorkStatistics() {
    // no charts just statistical data so no need for a carousel
  // stats should include:
  const [timePeriod, setTimePeriod] = React.useState('week');
  const [weekIndex, setWeekIndex] = React.useState(0);

  const dummyData = [
    {
      week: {
        tasksCompleted: 25,
        tasksInProgress: 10,
        tasksOverdue: 1,
        hoursWorked: 40,
      },
    },
    {
      week: {
        tasksCompleted: 30,
        tasksInProgress: 8,
        tasksOverdue: 2,
        hoursWorked: 42,
      },
    },
    {
      week: {
        tasksCompleted: 20,
        tasksInProgress: 12,
        tasksOverdue: 5,
        hoursWorked: 38,
      },
    },
  ];

  // Calculate monthly roundups based on weekly data
  const monthlyStats = dummyData.reduce(
    (acc, weekData) => {
      const weekStats = weekData.week;
      acc.tasksCompleted += weekStats.tasksCompleted;
      acc.tasksInProgress += weekStats.tasksInProgress;
      acc.tasksOverdue += weekStats.tasksOverdue;
      acc.hoursWorked += weekStats.hoursWorked;
      return acc;
    },
    {
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksOverdue: 0,
      hoursWorked: 0,
    }
  );

  const currentStats = timePeriod === 'week' 
    ? dummyData[weekIndex]?.week 
    : monthlyStats;

  const handlePrevWeek = () => {
    setWeekIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setWeekIndex(prev => Math.min(dummyData.length - 1, prev + 1));
  };

  const statItems = [
    {
      key: 'tasksCompleted',
      label: 'Tasks Completed',
      value: currentStats.tasksCompleted,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'tasksInProgress',
      label: 'Tasks In Progress',
      value: currentStats.tasksInProgress,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'tasksOverdue',
      label: 'Tasks Overdue',
      value: currentStats.tasksOverdue,
      color: currentStats.tasksOverdue > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: currentStats.tasksOverdue > 0 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      key: 'hoursWorked',
      label: 'Hours Worked',
      value: currentStats.hoursWorked,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      {/* Header with view toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Work Statistics</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimePeriod('week')}
            className={`px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium ${timePeriod === 'week' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium ${timePeriod === 'month' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Week navigation (only shown in week view) */}
      {timePeriod === 'week' && (
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevWeek}
              disabled={weekIndex === 0}
              className={`p-1 rounded-lg ${weekIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-medium text-gray-600">
              Week {weekIndex + 1}
            </span>
            <button
              onClick={handleNextWeek}
              disabled={weekIndex === dummyData.length - 1}
              className={`p-1 rounded-lg ${weekIndex === dummyData.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        {statItems.map((item) => (
          <div 
            key={item.key} 
            className={`p-2 rounded-lg ${item.bgColor} flex flex-col items-center justify-center`}
            style={{ minWidth: '100px', minHeight: '80px' }}
          >
            <span className="text-xs font-medium text-gray-500">{item.label}</span>
            <span className={`text-lg font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeWorkStatistics;