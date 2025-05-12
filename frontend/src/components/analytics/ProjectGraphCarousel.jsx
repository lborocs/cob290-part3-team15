import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ProjectTaskCompletionPieChart from './charts/ProjectTaskCompletionPieChart.jsx';
import ProjectTaskAllocationBarChart from './charts/ProjectTaskAllocationBarChart.jsx';
import ProjectTopContributorsBarChart from "./charts/ProjectTopContributorsBarChart.jsx";

function ProjectGraphCarousel({ selectedProjectId }) {

  const chartConfig = [
    {
      type: 'task-completion',
      title: 'Task Completion Status',
      description: 'Percentage of completed vs pending tasks',
      endpoint: '/api/analytics/projects/getTaskCompletionStatus',
      component: ProjectTaskCompletionPieChart,
    },
    {
      type: 'project-contributors',
      title: 'Top Contributors',
      description: 'Total hours worked by each team member',
      endpoint: '/api/analytics/projects/getTopContributors',
      component: ProjectTopContributorsBarChart,
    },
    {
      type: 'task-allocation',
      title: 'Task Allocation by User',
      description: 'Number of tasks assigned to each team member',
      endpoint: '/api/analytics/projects/getTaskAllocationAndPerformance',
      component: ProjectTaskAllocationBarChart,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({index: 0, data: null});
  const currentChart = chartConfig[currentIndex];
  const ChartComponent = chartConfig[chartData.index].component;

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

          // Format data for the task allocation bar chart
          if (currentChart.type === 'task-allocation') {
            const formattedData = response.data.map((item) => ({
              label: item.label,
              tasksAssigned: item.tasksAssigned,
              tasksCompleted: item.tasksCompleted,
            }));
            setChartData({index: currentIndex, data: formattedData});
          } else if (currentChart.type === 'project-contributors') {
            // Format data for the top contributors chart
            const formattedData = response.data.map((item) => ({
              name: `${item.forename} ${item.surname}`,
              hours: item.hours,
            }));
            setChartData({index: currentIndex, data: formattedData});
          }
          else {
            const formattedData = Array.isArray(response.data)
              ? response.data
              : [
                  { label: 'Completed', value: response.data.completed || 0 },
                  { label: 'Not Completed', value: response.data.pending || 0 },
                ];
            setChartData({index: currentIndex, data: formattedData});
          }
      } catch (error) {
          console.error('Error fetching chart data:', error);
          setChartData({index: 0, data: null});
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
          <ChartComponent data={chartData.data} />
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

export default ProjectGraphCarousel;