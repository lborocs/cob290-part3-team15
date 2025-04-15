import DropdownList from "./DropdownList";
// Found that useRef can be used to reference a div element and check if the click is outside of it
import { useEffect, useRef } from "react";
import { BsClipboard2Fill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
function ChatDropdown({ sentByUser, onClose, message, setEditing, setEditingMessage }) {
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
      navigator.clipboard.writeText(message.content); // Copy the message text to clipboard
      onClose(); // Close the dropdown when copy text is clicked
    }
    
    const handleEditMessage = () => {
      setEditing(true); // Set editing use state to true
      setEditingMessage(message); // Set the message to be edited
      onClose(); // Close the dropdown when edit message is clicked
    }
    
    const handleDeleteMessage = () => {
      // Put function to delete message here
      console.log('Delete message clicked'); 
      onClose(); // Close the dropdown when delete message is clicked
    }
    // List parameters to be passed to the DropdownList component

    // Use ternary operator to check if the message is sent by the user or not, pretty cool right?
    const items = 
    sentByUser ? ['Copy Text', 'Edit Message', 'Delete Message']
    : ['Copy Text'];

    const componentsFunctions = 
    sentByUser ? [copyText, handleEditMessage, handleDeleteMessage]
    : [copyText]; // Array of functions to call when item is clicked
    
    // Icons for each item in the list, if needed
    const icons = 
      sentByUser ? [<BsClipboard2Fill/>, <BsFillPencilFill/>, <BsFillTrashFill/>]
      : [<BsClipboard2Fill/>];

    return (
        <div ref={dropdownRef}>
          <DropdownList items={items} onClick={componentsFunctions} icons={icons} />
        </div>
    );
}

export default ChatDropdown;