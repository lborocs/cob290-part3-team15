import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './charts/PieChart.jsx';
import TaskAllocationBarChart from './charts/TaskAllocationBarChart.jsx';
import HorizontalBarChart from './charts/HorizontalBarChart.jsx';
import LineChart from './charts/LineChart.jsx';
import EmployeeHoursChart from './charts/EmployeeHoursChart.jsx';
import EmployeeProjectsChart from './charts/EmployeeProjectsChart.jsx';
import TopContributorsBarChart from "./charts/TopContributorsBarChart.jsx";

function ProjectStatisticsFieldCarousel({ selectedProjectId }) {

  const chartConfig = [
    {
      type: 'pie',
      title: 'Task Completion Status',
      description: 'Percentage of completed vs pending tasks',
      endpoint: '/api/analytics/projects/getTaskCompletionStatus',
      component: PieChart,
    },
    /* {
      type: 'employee-hours',
      title: 'My Weekly Hours',
      description: 'My hours worked in the past 4 weeks',
      component: EmployeeHoursChart,
    },
    {
      type: 'employee-projects',
      title: 'My Project Contributions',
      description: 'Tasks I contributed to by project',
      component: EmployeeProjectsChart,
    }, */
    {
      type: 'project-contributors',
      title: 'Top Contributors',
      description: 'Total hours worked by each team member',
      endpoint: '/api/analytics/projects/getTopContributors',
      component: TopContributorsBarChart,
    },
    {
      type: 'bar',
      title: 'Task Allocation by User',
      description: 'Number of tasks assigned to each team member',
      endpoint: '/api/analytics/projects/getTaskAllocationAndPerformance',
      component: TaskAllocationBarChart,
    },
    /* {
      type: 'horizontal-bar',
      title: 'Task Completion Efficiency',
      description: 'Tasks completed vs assigned by user',
      component: HorizontalBarChart,
    } */
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = currentChart.component;

  useEffect(() => {
    console.log("Project ID:", selectedProjectId); // Debugging
    const fetchData = async () => {
      try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.get(currentChart.endpoint, {
              params: { projectId: selectedProjectId },
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
          } else if (currentChart.type === 'project-contributors') {
            // Format data for the contributors chart
            const formattedData = response.data.map((item) => ({
              name: `${item.forename} ${item.surname}`,
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
                  { label: 'Not Completed', value: response.data.pending || 0 },
                ];
            setChartData(formattedData);
          }
      } catch (error) {
          console.error(`Error fetching data for ${currentChart.title}:`, error);
      }
    };

    fetchData();
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
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2">
      <div className="flex items-center w-full">
        <button
          className="px-4 py-2 rounded text-white bg-accentOrange hover:bg-accentOrange/70"
          onClick={() => handleNavigation('left')}
        >
          ←
        </button>

        <div className="flex flex-col items-center justify-center text-center mx-6 flex-grow h-full">
          <h2 className="text-xl font-semibold text-text mb-2">{currentChart.title}</h2>
          <div className="w-full max-w-md max-h-[63%] h-full mb-6">
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

      <div className="flex space-x-2 pb-4">
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

export default ProjectStatisticsFieldCarousel;