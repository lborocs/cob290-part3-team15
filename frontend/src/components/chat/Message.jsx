import MessageOptions from './MessageOptions.jsx';
import { use, useRef, useState, useEffect } from 'react';
import ChatDropdown from './ChatDropdown.jsx';
import { useFloating, offset, flip, shift, useDismiss,  autoUpdate} from '@floating-ui/react';
import HideMessageModal from './HideMessageModal.jsx';

function Content({ message }) {
  return (
    <>
      <div className="text-left w-fit">
          <p className="text-text">{message.content}</p>
      </div>

    </>
  );
}

function SelfMessage({ message,mode, setEditing, setEditingMessage, editingMessage, refs, floatingStyles, isDropdownOpen, toggleDropdown }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const [isHideModalOpen, setIsHideModalOpen] = useState(false); // State to control the modal
  const [messageToHide, setMessageToHide] = useState(null); // State to store the message to be hidden
  const messageRef = useRef(null);


  const isToday = new Date(message.timestamp).toDateString() === new Date().toDateString();
  const isYesterday = (() => {const yesterday = new Date();yesterday.setDate(new Date().getDate() - 1);return new Date(message.timestamp).toDateString() === yesterday.toDateString()})();
  const formattedTime = 
    isToday ? `${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : isYesterday ? `Yesterday at ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : `${String(new Date(message.timestamp).getDate()).padStart(2, '0')}/${String(new Date(message.timestamp).getMonth() + 1).padStart(2, '0')} ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`;

  
  const HandleHover = (e) => {
    if (e.type === 'mouseenter'){
      SetisHovered(true)
    } 
    else if (e.type === 'mouseleave'){
      SetisHovered(false)
    }
  };

  const openHideModal = () => {
    setMessageToHide(message); // Set the message to be hidden
    setIsHideModalOpen(true); // Open the modal
  };

  const closeHideModal = () => {
    setMessageToHide(null); // Clear the message
    setIsHideModalOpen(false); // Close the modal
  };

  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    // Stop the propagation so mousedown doesn't interfere
    event.stopPropagation();
    if (isDropdownOpen) {
      toggleDropdown(null); // Close the dropdown
    } else {
      toggleDropdown(message.messageID); // Open the dropdown for this message
    }
  };
  
  // Set up floating ui
  const { refs: dropdownRefs, floatingStyles: dropdownStyles, context } = useFloating({
    middleware: [
      offset(10), 
      flip(),         
      shift()
    ],
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    open: isDropdownOpen,
    onOpenChange: (open) => {
      if (!open) {
        toggleDropdown(null); // Close the dropdown when open changes to false
      }
    },
  }); 
  
  useDismiss(context, {
    outsidePressEvent: "mousedown",
    referencePress: false, // Prevent closing when clicking on the reference element
    bubbles: true, // Allow the event to bubble up to the parent elements
    trees: true, // Allow the event to bubble up to the parent elements
    outsidePress: (event) => {
      // If it's a right-click on the message element, don't close the dropdown
      if (event.button === 2 && messageRef.current && messageRef.current.contains(event.target)) {
        return false; // Returning false prevents the dropdown from closing
      }
      return true; // All other clicks should close the dropdown
    }
  });
  
  return(
    <div className="flex flex-col w-full ">
      {message.isNewDay && (
        <div className="flex items-center my-4">
          <div className="flex-grow border-t text-gray-400/50"></div>
          <span className="px-4 text-sm text-gray-500 whitespace-nowrap select-none">
            {new Date(message.timestamp).toLocaleDateString(undefined, {day: 'numeric',month: 'long',year: 'numeric',})}
          </span>
          <div className="flex-grow border-t text-gray-400/50"></div>
        </div>
      )}
      <div className="flex flex-col max-w-3/4 text-base font-medium self-end items-end justify-end relative">
        {message.showName &&
        <div className="w-fit justify-end">
          <p className="text-text text-xs ml-3 self-end font-light pb-[2px]">{formattedTime}</p>
        </div>
        }
      <div className={`${editingMessage?.messageID == message.messageID ? "border-1 border-green-400 ": ""} mb-2 rounded-lg border border-2 border-accentGreen/80 px-4 py-2 text-base font-medium bg-accentGreen/50 relative`} 
      onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick} ref={(node) => {messageRef.current = node; if (refs.setReference){refs.setReference(node)};}}>

        <div className="self-start text-pretty break-all">
          {isHovered && (
            <MessageOptions sentByUser={true} 
            isHoveredComment={isHovered}
            message={message} // Pass the message to the options
            setEditing={setEditing} // Pass the setMessage function to the options
            setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
            setIsDropdownOpen={toggleDropdown}
            />
          )}
          <Content message={message}/>
          {message.isEdited==1 && (<p className="text-right text-xs text-light text-gray-400 select-none">edited</p>)}
        </div>
        {isDropdownOpen && ( // Dropdown menu for right click options
          <ChatDropdown
            sentByUser={true}
            onClose = {()=> toggleDropdown(null)}
            message={message} // Pass the message to the dropdown
            setEditing={setEditing}
            setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
            refs={dropdownRefs} 
            floatingStyles={dropdownStyles}
            openHideModal={openHideModal} // Pass the openHideModal function to the dropdown
          />
        )}
        {
          isHideModalOpen && (
          <HideMessageModal
            open={isHideModalOpen}
            onClose={closeHideModal}
            message={messageToHide}
          />
          )
        }
          
      </div>
      </div>
    </div>
  )
}

function OtherMessage({ message, refs, floatingStyles, isDropdownOpen, toggleDropdown }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered]
  const messageRef = useRef(null); // Reference to the message element
  const HandleHover = (e) => {
    if (e.type === 'mouseenter'){
      SetisHovered(true)
    } 
    else if (e.type === 'mouseleave'){
      SetisHovered(false)
    }
  };

  const isToday = new Date(message.timestamp).toDateString() === new Date().toDateString();
  const isYesterday = (() => {const yesterday = new Date();yesterday.setDate(new Date().getDate() - 1);return new Date(message.timestamp).toDateString() === yesterday.toDateString()})();
  const formattedTime = 
    isToday ? `${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : isYesterday ? `Yesterday at ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : `${String(new Date(message.timestamp).getDate()).padStart(2, '0')}/${String(new Date(message.timestamp).getMonth() + 1).padStart(2, '0')} ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`;


  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    // Stop the propagation so mousedown doesn't interfere
    event.stopPropagation();
    if (isDropdownOpen) {
      toggleDropdown(null); // Close the dropdown
    } else {
      toggleDropdown(message.messageID); // Open the dropdown for this message
    }
  };

 // Set up floating ui
 const { refs: dropdownRefs, floatingStyles: dropdownStyles, context } = useFloating({
  middleware: [
    offset(10), 
    flip(),         
    shift()
  ],
  placement: "bottom-end",
  whileElementsMounted: autoUpdate,
  open: isDropdownOpen,
  onOpenChange: (open) => {
    if (!open) {
      toggleDropdown(null); // Close the dropdown when open changes to false
    }
  },
}); 

useDismiss(context, {
  outsidePressEvent: "mousedown",
  referencePress: false, // Prevent closing when clicking on the reference element
  bubbles: true, // Allow the event to bubble up to the parent elements
  trees: true, // Allow the event to bubble up to the parent elements
  outsidePress: (event) => {
    // If it's a right-click on the message element, don't close the dropdown
    if (event.button === 2 && messageRef.current && messageRef.current.contains(event.target)) {
      return false; // Returning false prevents the dropdown from closing
    }
    return true; // All other clicks should close the dropdown
  }
  });

  return(
    <div className="flex flex-col w-full ">
      {message.isNewDay && (
        <div className="flex items-center my-4">
          <div className="flex-grow border-t text-gray-400/50"></div>
          <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
            {new Date(message.timestamp).toLocaleDateString(undefined, {day: 'numeric',month: 'long',year: 'numeric',})}
          </span>
          <div className="flex-grow border-t text-gray-400/50"></div>
        </div>
      )}
      <div className="flex flex-col max-w-3/4 text-base font-medium self-start relative">
        {message.showName &&
        <div className="flex w-fit">
          <p className="text-text self-end font-light">{message.name}</p>
          <p className="text-text text-xs ml-3 self-end font-light pb-[2px]">{formattedTime}</p>
        </div>
        }
        <div className={`mb-2 w-fit rounded-lg border border-2 border-gray-400/20 px-4 py-2 bg-secondary relative`} onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick} ref={(node) => {messageRef.current = node; if (refs.setReference){refs.setReference(node)};}}>
          <div className="text-left flex flex-col text-pretty break-all">
            {isHovered && (
              <MessageOptions sentByUser={false} 
              isHoveredComment={isHovered} 
              message={message} // Pass the message to the options
              setEditing={null}
              setEditingMessage={null}
              setIsDropdownOpen={toggleDropdown}
              />
            )}
            <Content message={message}/>
            {message.isEdited==1 && (<p className="text-right text-xs font-light text-gray-400 select-none">edited</p>)}
          </div>
        </div>
        {isDropdownOpen && ( // Dropdown menu for right click options
          <ChatDropdown
          sentByUser={false}
          onClose = {()=> toggleDropdown(null)}
          message={message} // Pass the message to the dropdown
          setEditing={null}
          setEditingMessage={null} // Pass the setMessage function to the options
          refs={dropdownRefs}
          floatingStyles={dropdownStyles}
          />
        )}
      </div>
    </div>
  )
}






function Message({ messageContent , userID , mode, setEditing, setEditingMessage, editingMessage, boundaryRef, isDropdownOpen, toggleDropdown}) {
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
      setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} refs={refs} floatingStyles={floatingStyles} isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown}/> 
      : <OtherMessage message={messageContent} refs={refs} floatingStyles={floatingStyles} isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown}/>}
    </>
  );
}

export default Message;