import MessageOptions from './MessageOptions.jsx';
import { useState } from 'react';
import ChatDropdown from './ChatDropdown.jsx';
import { useFloating, offset, flip, shift } from '@floating-ui/react';

function Content({ message }) {
  return (
    <>
      <div className="text-left w-fit">
          <p className="text-text">{message.content}</p>
      </div>

    </>
  );
}

function SelfMessage({ message,mode, setEditing, setEditingMessage, editingMessage, refs, floatingStyles}) {
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
    <div className={`${editingMessage?.messageID == message.messageID ? "border-1 border-green-400 ": ""} max-w-3/4 my-2 rounded-lg border border-2 border-accentGreen/80 px-4 py-2 text-base font-medium self-end bg-accentGreen/50 relative`} 
    onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick} ref={refs.setReference}>
      <div className="self-start text-pretty break-all">
        {isHovered && (
          <MessageOptions sentByUser={true} 
          isHoveredComment={isHovered}
          message={message} // Pass the message to the options
          setEditing={setEditing} // Pass the setMessage function to the options
          setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
          setIsDropdownOpen={setIsDropdownOpen}
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
          refs={refs} 
          floatingStyles={floatingStyles}
        />
      )}
      
    </div>
  )
}

function OtherMessage({ message, refs, floatingStyles }) {
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
    <div className="max-w-3/4 text-base font-medium self-start relative">
      {message.showName &&
      <div className="w-fit">
        <p className="text-text">{message.name}</p>
      </div>
      }
      <div className={`mt-1 mb-2 rounded-lg border border-2 border-gray-400/20 px-4 py-2 bg-secondary relative`} onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick} ref={refs.setReference}>
        <div className="text-left flex flex-col text-pretty break-all">
          {isHovered && (
            <MessageOptions sentByUser={false} 
            isHoveredComment={isHovered} 
            message={message} // Pass the message to the options
            setEditing={null}
            setEditingMessage={null}
            setIsDropdownOpen={setIsDropdownOpen}
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
        setEditing={null}
        setEditingMessage={null} // Pass the setMessage function to the options
        refs={refs}
        floatingStyles={floatingStyles}
      />
      )}
    </div>
  )
}






function Message({ messageContent , userID , mode, setEditing, setEditingMessage, editingMessage, boundaryRef }) {
  //const [message,setMessage]=useState(messageContent);

  //Refs for modal handling
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(0), flip(), shift({ boundary: boundaryRef.current, padding: 8 })],
    placement: 'top-end',
  });

  const sentByUser = parseInt(messageContent.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  return (
    <>
      {sentByUser ? 
      <SelfMessage message={messageContent} mode={mode} 
      setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} refs={refs} floatingStyles={floatingStyles}/> 
      : <OtherMessage message={messageContent} refs={refs} floatingStyles={floatingStyles}/>}
    </>
  );
}

export default Message;