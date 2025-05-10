import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeWeeklyHoursChart from './charts/EmployeeWeeklyHoursChart.jsx';
import EmployeeContributionsByProjectChart from './charts/EmployeeContributionsByProjectChart.jsx';
import BurndownChart from './charts/BurndownChart.jsx'; // Import BurndownChart

function EmployeeGraphCarousel({ selectedProjectId }) {
  const chartConfig = [];

  // null is the 'id' for the overview
  if (selectedProjectId === null) {
    chartConfig.push(
      {
        type: 'employee-projects-overview',
        title: 'My Project Contributions',
        description: 'Tasks I contributed to by project',
        endpoint: '/api/analytics/employees/getAllEmployeeProjects',
        component: EmployeeContributionsByProjectChart,
      },
      {
        type: 'employee-hours-overview',
        title: 'My Weekly Hours',
        description: 'My hours worked in the past 4 weeks',
        endpoint: '/api/analytics/employees/getAllEmployeeHours',
        component: EmployeeWeeklyHoursChart,
      },
      {
        type: 'burndown',
        title: 'Burndown Chart',
        description: 'Track task completion over time',
        endpoint: '/api/analytics/employees/getBurndownData',
        component: BurndownChart,
      }
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
    <div className="relative flex flex-col p-4 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      {/* Header - properly centered */}
      <div className="w-full text-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{currentChart.title}</h3>
        <p className="text-sm text-gray-500">{currentChart.description}</p>
      </div>

      {/* Chart Container with navigation arrows */}
      <div className="w-full h-[65%] flex items-center justify-between mb-2">
        {/* Left arrow */}
        <button
          onClick={() => handleNavigation('left')}
          className="p-2 text-gray-500 hover:text-accentOrange transition-colors"
          aria-label="Previous chart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Chart area */}
        <div className="w-full h-full max-w-[85%] flex items-center justify-center">
          <ChartComponent data={chartData} />
        </div>

        {/* Right arrow */}
        <button
          onClick={() => handleNavigation('right')}
          className="p-2 text-gray-500 hover:text-accentOrange transition-colors"
          aria-label="Next chart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>


      {/* Navigation Dots - properly centered at bottom */}
      <div className="flex justify-center space-x-2 mt-auto">
        {chartConfig.map((chart, index) => (
          <div key={index}>
            <button
              className={`w-3 h-3 rounded-full transition-all peer ${
                index === currentIndex
                  ? 'bg-accentOrange scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />

            <span
              key={`tooltip-${index}`}
              className="absolute text-xs bg-black text-white px-2 py-1 rounded opacity-0 transition-opacity duration-300 peer-hover:opacity-100 pointer-events-none"
              style={{ transform: 'translate(-52%, -100%)' }}
            >
              {chart.title}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default EmployeeGraphCarousel;