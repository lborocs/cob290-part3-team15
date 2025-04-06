import DropdownList from "./DropdownList";
// Found that useRef can be used to reference a div element and check if the click is outside of it
import { useEffect, useRef } from "react";

function ChatDropdown({ sentByUser, onClose, SetOpenEditModal }) {
    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Close dropdown when clicking outside
    //
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            onClose(); // Call the onClose function to close the dropdown
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const copyText = () => {
        // Put function to copy text here
        console.log('Copy text clicked'); 
        onClose(); // Close the dropdown when copy text is clicked
    }
    
      const handleEditMessage = () => {
        SetOpenEditModal(true); // Open the edit message modal
        onClose(); // Close the dropdown when edit message is clicked
    }
    
      const handleDeleteMessage = () => {
        // Put function to delete message here
        console.log('Delete message clicked'); 
        onClose(); // Close the dropdown when delete message is clicked
    }
    
    // Use ternary operator to check if the message is sent by the user or not, pretty cool right?
    const items = 
    sentByUser ? ['Copy Text', 'Edit Message', 'Delete Message']
    : ['Copy Text', 'Delete Message'];
    const componentsFunctions = 
    sentByUser ? [copyText, handleEditMessage, handleDeleteMessage]
    : [copyText, handleDeleteMessage]; // Array of functions to call when item is clicked
    return (
        <div ref={dropdownRef}>
          <DropdownList items={items} onClick={componentsFunctions} />
        </div>
    );
}

export default ChatDropdown;