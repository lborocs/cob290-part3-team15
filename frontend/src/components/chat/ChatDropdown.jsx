import DropdownList from "./DropdownList";

function ChatDropdown({ sentByUser, onClose, SetOpenEditModal }) {
    
    const copyText = () => {
        // Put function to copy text here
        console.log('Copy text clicked'); 
        setIsDropdownOpen(false); // Close the dropdown when copy text is clicked
        onClose(); // Close the dropdown when copy text is clicked
    }
    
      const handleEditMessage = () => {
        SetOpenEditModal(true); // Open the edit message modal
        setIsDropdownOpen(false); // Close the dropdown when edit message is clicked
        onClose(); // Close the dropdown when edit message is clicked
    }
    
      const handleDeleteMessage = () => {
        // Put function to delete message here
        console.log('Delete message clicked'); 
        setIsDropdownOpen(false); // Close the dropdown when delete message is clicked
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
        <DropdownList
          items={items}
          onClick={componentsFunctions}
        />
      );
}

export default ChatDropdown;