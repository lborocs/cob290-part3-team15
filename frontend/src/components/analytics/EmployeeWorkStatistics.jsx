import {React, useEffect, useState} from 'react';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import axios from "axios";

function EmployeeWorkStatistics( { selectedProjectId } ) {
  const [selectedProject, setSelectedProject] = useState("Overview");
  const [timePeriod, setTimePeriod] = useState('week');
  const [weekIndex, setWeekIndex] = useState(0);
  const [workData, setWorkData] = useState([]);

  const fetchData = async() => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(`/api/analytics/employees/getWorkStatistics`, {
        params: {
          projectId: selectedProjectId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response?.data?.results) {
        const data = response.data.results.map((week) => {
          return ({
            weekStart: new Date(week.weekStart).toDateString(),
            weekEnd: new Date(week.weekEnd).toDateString(),
            tasksCompleted: week.completed,
            hoursWorked: week.hours,
            tasksAssigned: week.assigned,
            overdueTasks: week.overdue,
          })
        });

        // reverse data
        data.reverse();
    
        setWorkData(data);
        setWeekIndex(data.length - 1); // Set to the last week by default
      }

      // get the name of the project
      const projectResponse = await axios.get(`/api/analytics/employees/getProjectById`, {
        params: {
          projectId: selectedProjectId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (projectResponse?.data?.project) {
        setSelectedProject(projectResponse.data.project.title);
      } else {
        setSelectedProject("Overview")
      }

    }
    catch (error) {
      console.error("Error fetching work statistics data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  },[selectedProjectId])

  // Calculate monthly roundups based on weekly data
  const monthlyStats = workData.reduce(
    (acc, weekData) => {
      acc.tasksCompleted += weekData.tasksCompleted;
      acc.hoursWorked += +weekData.hoursWorked;
      acc.tasksAssigned += weekData.tasksAssigned;
      acc.overdueTasks += weekData.overdueTasks;
      return acc;
    },
    {
      tasksCompleted: 0,
      hoursWorked: 0,
      tasksAssigned: 0,
      overdueTasks: 0,
    }
  );

  const currentStats = timePeriod === 'week' 
    ? workData[weekIndex]
    : monthlyStats;

  const handlePrevWeek = () => {
    setWeekIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setWeekIndex(prev => Math.min(workData.length - 1, prev + 1));
  };

  const statItems = [
    {
      key: 'tasksCompleted',
      label: 'Tasks Completed',
      value: currentStats?.tasksCompleted,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'tasksAssigned',
      label: 'New Tasks Assigned',
      value: currentStats?.tasksAssigned,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'hoursWorked',
      label: 'Hours Worked',
      value: currentStats?.hoursWorked,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
    ,
    {
      key: 'overdueTasks',
      label: 'Deadlines Missed',
      value: currentStats?.overdueTasks,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Work Statistics - {selectedProject ? selectedProject : "Overview"}
        </h3>
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
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevWeek}
              disabled={weekIndex === 0}
              className={`p-1 rounded-lg ${weekIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-medium text-gray-600">
              {currentStats?.weekStart} - {currentStats?.weekEnd}
            </span>
            <button
              onClick={handleNextWeek}
              disabled={weekIndex === workData.length - 1}
              className={`p-1 rounded-lg ${weekIndex === workData.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 h-full">
        {statItems.map((item) => (
          <div 
            key={item.key} 
            className={`p-2 rounded-lg ${item.bgColor} flex flex-col items-center justify-center`}
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