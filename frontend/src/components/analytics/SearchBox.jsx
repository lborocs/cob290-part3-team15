import React from 'react';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
import { FiSearch } from 'react-icons/fi';

function SearchBox({ projects, onProjectSelect, selectedProject }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-start-2 row-start-4 col-span-4 row-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
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
              key={project.id}
              title={project.title}
              description={project.description}
              onClick={(passedProject=project) => onProjectSelect(passedProject)} // Accept an argument so we can deselect the project by clicking again
              isSelected={selectedProject?.title === project.title}
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