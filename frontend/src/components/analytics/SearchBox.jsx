import React, {useEffect, useState} from 'react';
import ProjectCard from './ProjectCard';
import {FiSearch} from 'react-icons/fi';
import axios from "axios";

function SearchBox({ userRole, onProjectSelect, selectedProjectId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);

  // get projects led by this user
  const getProjectList = async() => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      // get assigned projects for employee view or led projects for leader/manager view
      const endpoint = userRole === 'Employee' ? `/api/analytics/employees/getAssignedProjects`
                                                      : `/api/analytics/projects/getProjectsByLeader`;

      const responseLedProjects = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (responseLedProjects?.data?.projects.length > 0) {
        setProjects(responseLedProjects.data.projects);
      }
    }
    catch (error) {
      console.error("Error fetching search box data:", error);
    }
  }

  useEffect(() => {
    getProjectList();
  }, [userRole]);

  const onSelect = (id, title) => {
    // Set the selected project on the parent component using callback
    id === selectedProjectId ? onProjectSelect(null, "Overview") : onProjectSelect(id, title);
  }

  const filteredProjects = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-start-2 row-start-4 col-span-4 row-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
    <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
        <div className="flex items-center space-x-2">
          <select
            onChange={(e) => {
              const sortOrder = e.target.value;
              const sortedProjects = [...projects].sort((a, b) => {
                if (sortOrder === 'A-Z') return a.title.localeCompare(b.title);
                if (sortOrder === 'Z-A') return b.title.localeCompare(a.title);
                return 0;
              });
              setProjects(sortedProjects);
            }}
            className="px-3 py-1 bg-accentWhite/70 text-grey-600 rounded-full text-sm font-medium focus:outline-none"
          >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
            {filteredProjects.length} projects
          </span>
        </div>
    </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accentOrange focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-1">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={`card-${project.id}`}
              id={project.id}
              onClick={() => onSelect(project.id, project.title)}
              isSelected={selectedProjectId === project.id}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400">
            <FiSearch className="text-3xl mb-2" />
            <p>No projects found</p>

          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBox;