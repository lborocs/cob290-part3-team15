import React from 'react'
import { useState, useEffect } from 'react';
import WelcomeMessage from '../../components/analytics/WelcomeMessage';
import QuickStatistics from '../../components/analytics/QuickStatistics';
import SearchBox from '../../components/analytics/SearchBox';
import StatisticsFieldCarousel from '../../components/analytics/StatisticsFieldCarousel';
import StatisticsFieldBottom from '../../components/analytics/StatisticsFieldBottom';
import TasksList from '../../components/analytics/TasksList';


function Employee({ user, roleLabel }) {
  const [userData, setUserData] = useState({
    userName: user.name,
    role: roleLabel
  });

  const [projects, setProjects] = useState([
    { id: 1, title: 'Project Alpha', description: 'A project focused on alpha testing new features.' },
    { id: 2, title: 'Beta Build', description: 'A beta version of our upcoming product release.' },
    { id: 3, title: 'Gamma Initiative', description: 'An initiative to explore gamma ray applications.' },
    { id: 4, title: 'Delta Task', description: 'A task force dedicated to delta process improvements.' },
  ]);

  const [statistics, setStatistics] = useState([
    { id: 1, title: 'Statistic 1', value: '42', description: 'This is the first statistic.' },
    { id: 2, title: 'Statistic 2', value: '73%', description: 'This is the second statistic.' },
    { id: 3, title: 'Statistic 3', value: '120', description: 'This is the third statistic.' },
  ]);

  const [selectedProject, setSelectedProject] = useState({ title: 'Overview' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  return (
      <div className="grid grid-cols-12 grid-rows-7 gap-4 p-4 h-screen w-screen bg-primary">
        <WelcomeMessage
            userName={userData.userName}
            role={userData.role}
        />

        <div className="col-span-4 row-start-1 col-start-6 self-end text-start text-2xl font-bold test-text flex items-center justify-between">
          <span>{selectedProject.title}</span>
          {selectedProject.title !== 'Overview' && (
              <button
                  onClick={() => setSelectedProject({ title: 'Overview' })}
                  className="px-2 py-1 bg-secondary text-white rounded-md hover:bg-secondary-dark"
              >
                Back to Overview
              </button>
          )}
        </div>

        <div className="col-start-2 row-start-3 col-span-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            {statistics.map(stat => (
                <QuickStatistics
                    key={stat.id}
                    title={stat.title}
                    statisticValue={stat.value}
                />
            ))}
          </div>
        </div>

        <SearchBox
            projects={projects}
            onProjectSelect={handleProjectSelect}
            className="col-start-2 row-start-3"
        />

        <div className="col-start-6 row-start-2 col-span-6 row-span-5 rounded-3xl grid grid-cols-6 grid-rows-4 gap-4">
          <StatisticsFieldCarousel />
          <TasksList />
          <StatisticsFieldBottom />

        </div>
      </div>
  );
}

export default Employee