import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './charts/PieChart.jsx';
import TaskAllocationBarChart from './charts/TaskAllocationBarChart.jsx';
import HorizontalBarChart from './charts/HorizontalBarChart.jsx';
import LineChart from './charts/LineChart.jsx';
import EmployeeHoursChart from './charts/EmployeeHoursChart.jsx';
import EmployeeProjectsChart from './charts/EmployeeProjectsChart.jsx';

// Dummy data for the charts
const dummyData = {
  'employee-hours': [
    { week: 'Week 1', hours: 32 },
    { week: 'Week 2', hours: 38 },
    { week: 'Week 3', hours: 40 },
    { week: 'Week 4', hours: 35 }
  ],
  'employee-projects': [
    { project: 'Project Alpha', tasks: 12 },
    { project: 'Project Beta', tasks: 8 },
    { project: 'Project Gamma', tasks: 5 },
  ],
  'line': [ 
    { employee: "Ryan Gosling", hours: 15 },
    { employee: "Steve Roggers", hours: 42 },
    { employee: "Toby Maguire", hours: 6 },
    { employee: "Hugh Jackman", hours: 39 }
  ]
};

// !! I commented out everything so the page still renders, feel free to mess with it
function EmployeeStatisticsFieldCarousel({ selectedProject }) {

  /*
  const chartConfig = [
    {
      type: 'pie',
      title: 'Task Completion Status',
      description: 'Percentage of completed vs pending tasks',
      // todo: new endpoint for this
      endpoint: '/api/analytics/projects/getTaskCompletionStatus',
      component: PieChart,
    },
    {
      type: 'employee-hours',
      title: 'My Weekly Hours',
      description: 'My hours worked in the past 4 weeks',
      component: EmployeeHoursChart,
    },
    {
        // and for this 
      type: 'employee-projects',
      title: 'My Project Contributions',
      description: 'Tasks I contributed to by project',
      component: EmployeeProjectsChart,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = currentChart.component;

  useEffect(() => {
    console.log("Project ID:", selectedProject.id); // Debugging
    const fetchData = async () => {
      try {
        // dummy data for the new employee charts
        if (['employee-hours', 'employee-projects', 'line'].includes(currentChart.type)) {
          setChartData(dummyData[currentChart.type]);
          return;
        }
          const accessToken = localStorage.getItem('accessToken');
          const url = `${currentChart.endpoint}?projectId=${encodeURIComponent(selectedProject.id)}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log(`Response for ${currentChart.title}:`, response.data);

          // Format data for the bar chart
          if (currentChart.type === 'bar') {
            const formattedData = response.data.map((item) => ({
              label: item.label,
              tasksAssigned: item.tasksAssigned,
              tasksCompleted: item.tasksCompleted,
            }));
            setChartData(formattedData);
          } else if (currentChart.type === 'line') {
            // Format data for the line chart
            const formattedData = response.data.map((item) => ({
              employee: item.employee,
              hours: item.hours,
            }));
            setChartData(formattedData);
          }
          else {
            // Format data for the pie chart
            const formattedData = Array.isArray(response.data)
              ? response.data
              : [
                  { label: 'Completed', value: response.data.completed || 0 },
                  { label: 'Pending', value: response.data.pending || 0 },
                ];
            setChartData(formattedData);
          }
      } catch (error) {
          console.error(`Error fetching data for ${currentChart.title}:`, error);
      }
    };

    fetchData();
  }, [currentIndex, selectedProject.id]);

  const handleNavigation = (direction) => {
    setCurrentIndex((prev) =>
      (prev + (direction === 'left' ? -1 : 1) + chartConfig.length) % chartConfig.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNavigation('right');
      if (e.key === 'ArrowLeft') handleNavigation('left');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); */

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      <p>Employee carousel</p>
      {/*
      <button
        className="px-4 py-2 rounded text-white bg-accentOrange hover:bg-accentOrange/70"
        onClick={() => handleNavigation('left')}
      >
        ←
      </button>

      <div className="flex flex-col items-center justify-center text-center mx-6 flex-grow h-full">
        <h2 className="text-xl font-semibold text-text mb-4">{currentChart.title}</h2>
        <div className="w-full max-w-md max-h-[220px] h-full mb-4">
          <ChartComponent data={chartData} />
        </div>
        <p className="text-gray-600 px-2">{currentChart.description}</p>
      </div>

      <button
        className="px-4 py-2 rounded text-white bg-accentOrange hover:bg-accentOrange/70"
        onClick={() => handleNavigation('right')}
      >
        →
      </button>
      */}
    </div>
  );
}

export default EmployeeStatisticsFieldCarousel;