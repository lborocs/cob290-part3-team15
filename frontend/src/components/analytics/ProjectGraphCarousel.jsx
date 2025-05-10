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

          // Format data for the task allocation bar chart
          if (currentChart.type === 'task-allocation') {
            const formattedData = response.data.map((item) => ({
              label: item.label,
              tasksAssigned: item.tasksAssigned,
              tasksCompleted: item.tasksCompleted,
            }));
            setChartData(formattedData);
          } else if (currentChart.type === 'project-contributors') {
            // Format data for the top contributors chart
            const formattedData = response.data.map((item) => ({
              name: `${item.forename} ${item.surname}`,
              hours: item.hours,
            }));
            setChartData(formattedData);
          }
          else {
            // Format data for the task completion pie chart
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
            className={`w-3 h-3 rounded-full group ${
              index === currentIndex ? 'bg-accentOrange' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span
              className="absolute text-xs bg-black text-white px-2 py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
              style={{ transform: 'translate(-48%, -150%)' }}
            >
              {chart.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectGraphCarousel;