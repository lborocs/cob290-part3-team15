import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';

function MessageOptions({sentByUser, isHoveredComment, message, setEditing, setEditingMessage,setIsDropdownOpen}) {
    const [isHoveredEdit, SetIsHoveredEdit] = useState(false);
    
    const HandleMouseEnterEdit = () => {
        SetIsHoveredEdit(true); // Sets hover state to true when mouse enters
      };
    
    const HandleMouseLeaveEdit = () => {
        SetIsHoveredEdit(false); // Opposite of the above
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility, i.e from open to close and vice versa
      };

    const closeDropdown = () => {
        setIsDropdownOpen(false); // Close the dropdown
    };

    return (
        <>
            {isHoveredComment && (
                <div className="flex rounded-lg bg-white space-x-2 absolute right-0 bottom-10 y-10 z-40">
                    {/* Dropdown button */}
                    <button 
                    onClick={toggleDropdown} 
                    className="p-1"
                    >
                        <BsThreeDots className="text-gray-200 hover:text-purple-200" />
                    </button>
                    {/* Edit button */}
                    {sentByUser &&
                    <button
                    onClick={() => {
                    setEditing(true); // Set editing state to true when edit button is clicked
                    setEditingMessage(message); // Set the message to be edited
                    }}
                    className="p-1"
                    onMouseEnter={HandleMouseEnterEdit}
                    onMouseLeave={HandleMouseLeaveEdit}
                    >
                    {isHoveredEdit ? <BsPencilFill className="text-purple-200" /> : <BsPencil className="text-gray-200" />}
                    </button>
                    }
                </div>
            )}
        </>
      )
}

export default MessageOptions; 