import React, { useState } from 'react';
function ProjectCard({ title, description, onClick }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleExpandClick = (e) => {
      e.stopPropagation(); // Prevent parent onClick from firing
      setIsExpanded(!isExpanded);
    };
  
    return (
      <div
        className={`p-2 rounded-md shadow-sm bg-white/85 flex flex-col hover:bg-gray-100 hover:cursor-pointer ${
          isExpanded ? '' : 'h-24'
        } transition-all duration-200 relative z-10`}
        style={isExpanded ? { height: 'auto' } : {}}
        onClick={onClick} // Pass click handler for the entire card
      >
        <h2 className="text-lg font-semibold mb-0.5">{title}</h2>
        <p className={`text-xs text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}> {description} </p>
        {description.length > 50 && (
          <button
            className="text-blue-400 mt-1 text-xs"
            onClick={handleExpandClick}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  }

export default ProjectCard;