import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
import DropdownList from './DropdownList';
function MessageOptions({sentByUser, isHoveredComment, SetOpenEditModal}) {
    const [isHoveredEdit, SetIsHoveredEdit] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const HandleMouseEnterEdit = () => {
        SetIsHoveredEdit(true); // Sets hover state to true when mouse enters
      };
    
    const HandleMouseLeaveEdit = () => {
        SetIsHoveredEdit(false); // Opposite of the above
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility, i.e from open to close and vice versa
      };
    const copyText = () => {
        // Put function to copy text here
        console.log('Copy text clicked'); 
        setIsDropdownOpen(false); // Close the dropdown when copy text is clicked
    }

    const handleEditMessage = () => {
        SetOpenEditModal(true); // Open the edit message modal
        setIsDropdownOpen(false); // Close the dropdown when edit message is clicked
    }
    
    const handleDeleteMessage = () => {
        // Put function to delete message here
        console.log('Delete message clicked'); 
        setIsDropdownOpen(false); // Close the dropdown when delete message is clicked
    }

    const items = ['Copy Text', 'Edit Message', 'Delete Message'];
    const componentsFunctions = [copyText, handleEditMessage, handleDeleteMessage]; // Array of functions to call when item is clicked
    

    return (
        <>
            {isHoveredComment && (
                <div className="flex rounded-lg bg-white space-x-2 absolute right-0 bottom-10 y-10 z-40">
                    <button 
                    onClick={toggleDropdown} 
                    className="p-1"
                    >
                        <BsThreeDots className="text-gray-200 hover:text-purple-200" />
                    </button>
                    {isDropdownOpen && (
                        <DropdownList
                            items={items}
                            onClick = {componentsFunctions}
                        />
                    )}
                    {/* Edit button */}
                    {sentByUser &&
                    <button
                    onClick={() => {
                        SetOpenEditModal(true)
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