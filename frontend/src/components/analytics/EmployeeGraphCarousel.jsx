import React, {useEffect, useState} from 'react';
import axios from 'axios';
import EmployeeWeeklyHoursChart from './charts/EmployeeWeeklyHoursChart.jsx';
import EmployeeContributionsByProjectChart from './charts/EmployeeContributionsByProjectChart.jsx';
import BurndownChart from './charts/BurndownChart.jsx';
import {FiSearch} from "react-icons/fi"; // Import BurndownChart

function EmployeeGraphCarousel({ selectedProjectId }) {
  const chartConfig = [
      {
          type: 'employee-projects-overview',
          title: 'My Project Contributions',
          description: 'Tasks I contributed to by project',
          endpoint: '/api/analytics/employees/getContributionData',
          component: EmployeeContributionsByProjectChart,
      },
      {
          type: 'burndown',
          title: 'Task Burndown',
          description: 'Track hours of work remaining over time',
          endpoint: '/api/analytics/employees/getBurndownData',
          component: BurndownChart,
      },
      {
          type: 'employee-hours-overview',
          title: 'My Weekly Hours',
          description: 'My hours worked in the past 4 weeks',
          endpoint: '/api/analytics/employees/getWeeklyHoursData',
          component: EmployeeWeeklyHoursChart,
      }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({index: 0, data: null});
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = chartConfig[chartData.index].component;

 // fetch data for the current chart
 const fetchChartData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(currentChart.endpoint, {
        params: { projectId: selectedProjectId },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setChartData({index: currentIndex, data: response.data.results});
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData({index: 0, data: null});
    }
  };

  useEffect(() => {
    if (currentChart.endpoint) {
      fetchChartData();
    }
  }, [currentIndex, selectedProjectId]);

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
        <div className="w-full max-w-[80%] h-full max-h-[50%] flex items-center justify-center">
            {chartData?.data?.length > 0 || chartData?.data?.content?.length > 0 ? (
                <ChartComponent data={chartData.data} />
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400">
                    <FiSearch className="text-3xl mb-2" />
                    <p>No data available</p>
                </div>
            )}
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