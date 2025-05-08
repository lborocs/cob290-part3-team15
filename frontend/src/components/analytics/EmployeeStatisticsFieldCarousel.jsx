import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './charts/PieChart.jsx';
import TaskAllocationBarChart from './charts/TaskAllocationBarChart.jsx';
import HorizontalBarChart from './charts/HorizontalBarChart.jsx';
import LineChart from './charts/LineChart.jsx';
import EmployeeHoursChart from './charts/EmployeeHoursChart.jsx';
import EmployeeProjectsChart from './charts/EmployeeProjectsChart.jsx';

function EmployeeStatisticsFieldCarousel({ selectedProjectId }) {
  const chartConfig = [];

  // null is the 'id' for the overview
  if (selectedProjectId === null) {
    chartConfig.push(
      {
        type: 'employee-projects-overview',
        title: 'My Project Contributions',
        description: 'Tasks I contributed to by project',
        endpoint: '/api/analytics/employees/getAllEmployeeProjects',
        component: EmployeeProjectsChart,
      },
      {
        type: 'employee-hours-overview',
        title: 'My Weekly Hours',
        description: 'My hours worked in the past 4 weeks',
        endpoint: '/api/analytics/employees/getAllEmployeeHours',
        component: EmployeeHoursChart,
      },
    );
  } else {
      chartConfig.push(
        {
          type: 'employee-projects',
          title: 'My Project Contributions',
          description: 'Tasks I contributed to by project',
          component: EmployeeProjectsChart
        },
        {
          type: 'employee-hours',
          title: 'My Weekly Hours',
          description: 'My hours worked in the past 4 weeks',
          endpoint: '/api/analytics/employees/getEmployeeHours',
          component: EmployeeHoursChart,
        },
      );

  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = currentChart.component;

 // fetch data for the current chart
  const fetchChartData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(currentChart.endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { projectId: selectedProjectId },
      });
      setChartData(response.data.results);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
    }
  };
  useEffect(() => {
    if (currentChart.endpoint) {
      fetchChartData();
    }
  }, [currentChart.endpoint, selectedProjectId]);

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
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      <div className="flex items-center w-full">
        <button
          className="px-4 py-2 rounded text-white bg-accentOrange hover:bg-accentOrange/70"
          onClick={() => handleNavigation('left')}
        >
          ←
        </button>

        <div className="flex flex-col items-center justify-center text-center mx-6 flex-grow h-full">
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
      </div>

      <div className="absolute bottom-4 flex space-x-2">
        {chartConfig.map((chart, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-accentOrange' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span
              className="absolute text-xs bg-black text-white px-2 py-1 rounded opacity-0 transition-opacity duration-300 pointer-events-none"
              style={{ transform: 'translateY(20%)' }}
            >
              {chart.title}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        button:hover span {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default EmployeeStatisticsFieldCarousel;