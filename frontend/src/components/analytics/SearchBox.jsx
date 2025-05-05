import React from 'react'
import { useState } from 'react';
import ProjectCard from './ProjectCard'; // Assuming ProjectCard is the component for individual projects

function SearchBox({ projects, onProjectSelect, selectedProject }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-start-2 row-start-4 col-span-4 row-span-3 bg-secondary/40 rounded-3xl p-4 flex flex-col justify-start">
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded-3xl border border-gray-300 mb-4"
      />
      <div
        className="flex flex-wrap gap-2 overflow-y-auto justify-between"

        style={{ maxHeight: '300px' }}
      >
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="flex-1 min-w-[30%] max-w-[30%] box-border"
          >
            <ProjectCard 
              title={project.title}
              description={project.description}
              onClick={(passedProject=project) => onProjectSelect(passedProject)} // Accept an argument in case we want to reset project to overview
              isSelected={selectedProject.title===project.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBox