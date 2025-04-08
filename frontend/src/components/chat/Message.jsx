import MessageOptions from './MessageOptions.jsx';
import { useState } from 'react';
import EditMessageModal from './EditMessageModal.jsx';
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

function SelfMessage({ message,setMessage,mode }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const [openEditModal, SetOpenEditModal] = useState(false); // Default is not open and checks if the edit modal is open
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
    <div className={`max-w-3/4 my-2 rounded-lg border border-2 border-accentBlue/80 px-4 py-2 text-base font-medium self-end bg-accentBlue/50 relative`}onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick}>
      <div className="self-start text-pretty break-all">
        {isHovered && !openEditModal && (
          <MessageOptions sentByUser={true} 
          isHoveredComment={isHovered}
          SetOpenEditModal = {SetOpenEditModal}
          />
        )}
        <Content message={message}/>
      </div>
      <EditMessageModal // Edit message modal only needed for self messages
        open={openEditModal}
        onClose={() => {
          SetOpenEditModal(false);
          SetisHovered(false); // Reset the hover state for message options
        }}
        message={message} // Pass the content of the message to the modal to set it as default
        setMessage={setMessage} //To allow the modal to directly modify the user's screen display
        mode={mode}
        
      />
      {isDropdownOpen && ( // Dropdown menu for right click options
        <ChatDropdown
          sentByUser={true}
          onClose = {closeDropdown}
          SetOpenEditModal = {SetOpenEditModal}
          message={message} // Pass the message to the dropdown
        />
        
      )}
      
    </div>
  )
}

function OtherMessage({ message }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const [openEditModal, SetOpenEditModal] = useState(false); // Default is not open and checks if the edit modal is open
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
          {isHovered && !openEditModal && (
            <MessageOptions sentByUser={false} 
            isHoveredComment={isHovered} 
            SetOpenEditModal = {null}
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






function Message({ messageContent , userID , mode}) {
  const [message,setMessage]=useState(messageContent);
  const sentByUser = parseInt(message.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  return (
    <>
      {sentByUser ? <SelfMessage message={message} setMessage={setMessage}  mode={mode}/> : <OtherMessage message={message}/>}
    </>
  );
}

export default Message;