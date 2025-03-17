import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
function MessageOptions(){
    const [isHoveredEdit, setIsHoveredEdit] = useState(false);
    const [isHoveredOptions, setIsHoveredOptions] = useState(false);  
    const handleMouseEnterEdit = () => {
        setIsHoveredEdit(true);
      };
    
    const handleMouseLeaveEdit = () => {
        setIsHoveredEdit(false);
    };
    
    const handleMouseEnterOptions = () => {
        setIsHoveredOptions(true);
    };
    
    const handleMouseLeaveOptions = () => {
        setIsHoveredOptions(false);
    };

    return (
        <div className="flex space-x-2 justify-end">
            <button 
            // onClick={} 
            className="p-1 hover: "
            onMouseEnter={handleMouseEnterOptions}
            onMouseLeave={handleMouseLeaveOptions}
            >
            {isHoveredOptions ? <BsThreeDots className="text-purple-200" /> : <BsThreeDots className="text-gray-200" />}
            </button>
            <button
            // onClick={}
            className="p-1 hover: "
            onMouseEnter={handleMouseEnterEdit}
            onMouseLeave={handleMouseLeaveEdit}
            >
            {isHoveredEdit ? <BsPencilFill className="text-purple-200" /> : <BsPencil className="text-gray-200" />}
            </button>
        </div>
      )
}

export default MessageOptions; 