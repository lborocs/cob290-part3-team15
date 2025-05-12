import React, {useEffect, useState} from 'react';
import axios from "axios";

function ProjectCard({ id, onClick, isSelected }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState({});

    const getProjectCardInfo = async() => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const responseProjects = await axios.get(`/api/analytics/projects/getProjectCardInfo?id=${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            let title = responseProjects.data.results[0].title;
            let description = responseProjects.data.results[0].description;
            setContent({title: title, description: description});
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        getProjectCardInfo();
    }, [id]);

    const handleExpandClick = (e) => {
      e.stopPropagation(); // Prevent parent onClick from firing
      setIsExpanded(!isExpanded);
    };
  
    return (
      <div
        className={`p-2 rounded-md bg-white border border-gray-100 flex flex-col hover:border-orange-200 hover:shadow-lg cursor-pointer transition-all duration-200 relative z-10
        ${isSelected ? 'ring-1 ring-accentOrange shadow-md' : 'shadow-sm'}  
        ${isExpanded ? '' : 'h-24'}`}
        style={isExpanded ? { height: 'auto' } : {}}
        onClick={() => {
            if (isSelected) onClick(null) // Deselect if clicking selected project
            else onClick(id); // Pass click handler for the entire card
        }}
      >
        <h2 className="text-lg font-semibold mb-0.5">{content.title}</h2>
        <p className={`text-xs text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}> {content.description} </p>
        {content?.description?.length > 55 && (
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