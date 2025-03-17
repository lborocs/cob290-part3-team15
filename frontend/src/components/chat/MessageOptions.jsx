import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
function MessageOptions(){
    const [isHovered, setIsHovered] = useState(false);
      
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
      
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div className="flex space-x-2">
            <button 
            // onClick={} 
            className="p-1 hover:bg-gray-200 rounded">
            <BsThreeDots className="text-gray-600" />
            </button>
            <button
            // onClick={}
            className="p-1 hover:bg-gray-200 rounded"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
            {isHovered ? <BsPencilFill className="text-gray-600" /> : <BsPencil className="text-gray-600" />}
          </button>
        </div>
      )
}

export default MessageOptions; 