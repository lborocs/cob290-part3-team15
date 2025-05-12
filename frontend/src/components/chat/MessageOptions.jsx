import {BsPencil, BsPencilFill, BsThreeDots} from "react-icons/bs";
import {useState} from 'react';

function MessageOptions({sentByUser, message, setEditing, setEditingMessage,setIsDropdownOpen}) {
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

    return (
        <div className="flex rounded-lg bg-white space-x-2 z-40 p-1">
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

            {/* Dropdown button */}
            <button 
            onClick={toggleDropdown} 
            className="p-1"
            >
                <BsThreeDots className="text-gray-200 hover:text-purple-200" />
            </button>
        </div>
      )
}

export default MessageOptions; 