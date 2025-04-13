import MessageOptions from './MessageOptions.jsx';
import { useState } from 'react';
import ChatDropdown from './ChatDropdown.jsx';
function Content({ message }) {
  return (
    <>
      <div className="text-left w-fit">
          {message.content}
      </div>

    </>
  );
}

function SelfMessage({ message,mode, setEditing, setEditingMessage, editingMessage }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Default is not open and checks if the dropdown is open
  const HandleHover = (e) => {
    if (e.type === 'mouseenter'){
      SetisHovered(true)
    } 
    else if (e.type === 'mouseleave'){
      SetisHovered(false)
    }
  };

  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility, i.e from open to close and vice versa
  };

  // Close dropdown when clicking outside of it
  const closeDropdown = () => { // Copied from message options
    setIsDropdownOpen(false); // Close the dropdown
  };
  
  //console.log("Editing Message ID:", editingMessage?.messageID);
  return(
    <div className={`${editingMessage?.messageID == message.messageID ? "border-1 border-green-400 ": ""} max-w-3/4 my-2 rounded-lg border border-2 border-accentGreen/80 px-4 py-2 text-base font-medium self-end bg-accentGreen/50 relative`}onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick}>
      <div className="self-start text-pretty break-all">
        {isHovered && (
          <MessageOptions sentByUser={true} 
          isHoveredComment={isHovered}
          message={message} // Pass the message to the options
          setEditing={setEditing} // Pass the setMessage function to the options
          setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
          />
        )}
        <Content message={message}/>
      </div>
      {isDropdownOpen && ( // Dropdown menu for right click options
        <ChatDropdown
          sentByUser={true}
          onClose = {closeDropdown}
          message={message} // Pass the message to the dropdown
          setEditing={setEditing}
          setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
        />
      )}
      
    </div>
  )
}

function OtherMessage({ message }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Default is not open and checks if the dropdown is open
  const HandleHover = (e) => {
    if (e.type === 'mouseenter'){
      SetisHovered(true)
    } 
    else if (e.type === 'mouseleave'){
      SetisHovered(false)
    }
  };

  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility, i.e from open to close and vice versa
  };

  // Close dropdown when clicking outside of it
  const closeDropdown = () => { // Copied from message options
    setIsDropdownOpen(false); // Close the dropdown
  };

  return(
    <div className="max-w-3/4 text-base font-medium self-start">
      {message.showName &&
      <div className="w-fit">
        {message.name}
      </div>
      }
      <div className={`mt-1 mb-2 rounded-lg border border-2 border-gray-400/20 px-4 py-2 bg-secondary relative`}onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick}>
        <div className="text-left flex flex-col text-pretty break-all">
          {isHovered && (
            <MessageOptions sentByUser={false} 
            isHoveredComment={isHovered} 
            message={message} // Pass the message to the options
            />
          )}
          <Content message={message}/>
        </div>
      </div>
      {isDropdownOpen && ( // Dropdown menu for right click options
        <ChatDropdown
        sentByUser={false}
        onClose = {closeDropdown}
        message={message} // Pass the message to the dropdown
      />
      )}
    </div>
  )
}






function Message({ messageContent , userID , mode, setEditing, setEditingMessage, editingMessage }) {
  //const [message,setMessage]=useState(messageContent);
  const sentByUser = parseInt(messageContent.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  return (
    <>
      {sentByUser ? <SelfMessage message={messageContent} mode={mode} setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage}/> : <OtherMessage message={messageContent}/>}
    </>
  );
}

export default Message;