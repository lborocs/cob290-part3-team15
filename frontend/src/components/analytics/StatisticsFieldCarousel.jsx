import React, { useState, useEffect } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';

const chartData = [
  {
    type: 'pie',
    data: [
      { label: 'Completed', value: 75 },
      { label: 'Pending', value: 25 }
    ],
    title: 'Task Completion Status',
    description: 'Percentage of completed vs pending tasks',
    component: PieChart
  },
  {
    type: 'bar',
    data: [
      { label: 'User 1', value: 12 },
      { label: 'User 2', value: 19 },
      { label: 'User 3', value: 8 },
      { label: 'User 4', value: 51 },
      { label: 'User 5', value: 10 }
    ],
    title: 'Task Allocation by User',
    description: 'Number of tasks assigned to each team member',
    component: BarChart
  },
  {
    type: 'horizontalBar',
    data: [
      { label: 'User 1', value: 6 },
      { label: 'User 2', value: 15 },
      { label: 'User 3', value: 7 },
      { label: 'User 4', value: 12 },
      { label: 'User 5', value: 38 }
    ],
    title: 'Top Performers',
    description: 'Tasks completed by each team member',
    component: HorizontalBarChart
  }
];

function StatisticsFieldCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentChart = chartData[currentIndex];
  const ChartComponent = currentChart.component;

  const handleNavigation = (direction) => {
    setCurrentIndex(prev => 
      (prev + (direction === 'left' ? -1 : 1) + chartData.length) % chartData.length);
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
          <ChartComponent data={currentChart.data} />
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