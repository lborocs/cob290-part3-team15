import DropdownList from "../other/DropdownList";
import { useEffect, useRef } from "react";
import { BsClipboard2Fill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
function ChatDropdown({ sentByUser, onClose, message, setEditing, setEditingMessage,refs,floatingStyles, openHideModal }) {
  
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
      openHideModal(); // Open the hide message modal 
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
        <>
          <DropdownList items={items} onClick={componentsFunctions} icons={icons} refs={refs} floatingStyles={floatingStyles} blurBackground={true}/>
        </>
    );
}

export default ChatDropdown;