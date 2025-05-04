import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';
import BarChart from './BarChart';
import LineChart from './LineChart'; 
import { el } from '@faker-js/faker';

const chartConfig = [
  {
    type: 'pie',
    title: 'Task Completion Status',
    description: 'Percentage of completed vs pending tasks',
    endpoint: '/api/analytics/getTaskCompletionStatus',
    component: PieChart,
  },
  {
    type: 'bar',
    title: 'Task Allocation by User',
    description: 'Number of tasks assigned to each team member',
    endpoint: '/api/analytics/getTaskAllocationAndPerformance',
    component: BarChart,
  },
  {
    type: 'line',
    title: 'Hours Worked by User',
    description: 'Total hours worked by each team member',
    endpoint: '/api/analytics/getUserWeeklyHours',
    component: LineChart,
  }
];

function StatisticsFieldCarousel({ project }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = currentChart.component;

  useEffect(() => {
    console.log("Project ID:", project.id); // Debugging
    const fetchData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(currentChart.endpoint, {
                params: { projectId: project.id },
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
  }, [currentIndex, project.id]);

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
    <div className="flex items-center justify-between p-6 bg-secondary/50 rounded-3xl col-span-4 row-span-2 h-full">
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
    </div>
  );
}

export default StatisticsFieldCarousel;