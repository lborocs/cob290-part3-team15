import MessageOptions from './MessageOptions.jsx';
import {useRef, useState} from 'react';
import ChatDropdown from './ChatDropdown.jsx';
import {autoUpdate, flip, offset, shift, useDismiss, useFloating, useHover,} from '@floating-ui/react';
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

function SelfMessage({ message, setEditing, setEditingMessage, editingMessage, toggleDropdown, dropdownRefs, SetisHovered, isHovered }) {
  const messageRef = useRef(null);

  const isToday = new Date(message.timestamp).toDateString() === new Date().toDateString();
  const isYesterday = (() => {const yesterday = new Date();yesterday.setDate(new Date().getDate() - 1);return new Date(message.timestamp).toDateString() === yesterday.toDateString()})();
  const formattedTime = 
    isToday ? `${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : isYesterday ? `Yesterday at ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : `${String(new Date(message.timestamp).getDate()).padStart(2, '0')}/${String(new Date(message.timestamp).getMonth() + 1).padStart(2, '0')} ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`;

  
  const { refs: hoverRefs, floatingStyles: hoverStyles, context: hoverContext } = useFloating({
    placement: "top-end",
    middleware: [offset(-2)],
    whileElementsMounted: autoUpdate,
    open: false,
    onOpenChange: (open) => {SetisHovered(open)}});
  useHover(hoverContext, { move: false });


  const setRefs = (element) => {
    dropdownRefs.setReference(element);
    hoverRefs.setReference(element);
  };

  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    // Stop the propagation so mousedown doesn't interfere
    event.stopPropagation();
    toggleDropdown();
  }; 
  
  return(
    <div className={`flex flex-col w-full`}>
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
        <div ref={messageRef}>
          <div className={`${editingMessage?.messageID == message.messageID ? "border-1 border-green-400 ": ""} mb-2 rounded-lg border border-2 border-accentGreenBorder px-4 py-2 text-base font-medium bg-accentGreen relative`} onContextMenu={HandleRightClick} ref={setRefs}>
            <div className="self-start text-pretty break-all">
              {isHovered && (
                <div ref={hoverRefs.setFloating} style={hoverStyles}>
                <MessageOptions sentByUser={true} 
                message={message} // Pass the message to the options
                setEditing={setEditing} // Pass the setMessage function to the options
                setEditingMessage={setEditingMessage} // Pass the setMessage function to the options
                setIsDropdownOpen={toggleDropdown}
                />
                </div>
              )}
              <Content message={message}/>
              {message.isEdited==1 && (<p className="text-right text-xs text-light text-gray-400 select-none">edited</p>)}
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

function OtherMessage({ message, toggleDropdown, dropdownRefs, SetisHovered, isHovered }) {
  const messageRef = useRef(null); // Reference to the message element

  const { refs: hoverRefs, floatingStyles: hoverStyles, context: hoverContext } = useFloating({
    placement: "top-end",
    middleware: [offset(-2)],
    whileElementsMounted: autoUpdate,
    open: false,
    onOpenChange: (open) => {SetisHovered(open)}});
    useHover(hoverContext, { move: false });

  const isToday = new Date(message.timestamp).toDateString() === new Date().toDateString();
  const isYesterday = (() => {const yesterday = new Date();yesterday.setDate(new Date().getDate() - 1);return new Date(message.timestamp).toDateString() === yesterday.toDateString()})();
  const formattedTime = 
    isToday ? `${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : isYesterday ? `Yesterday at ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : `${String(new Date(message.timestamp).getDate()).padStart(2, '0')}/${String(new Date(message.timestamp).getMonth() + 1).padStart(2, '0')} ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`;


  //Anti Right Click
  const HandleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleDropdown()
  };


  const setRefs = (element) => {
    dropdownRefs.setReference(element);
    hoverRefs.setReference(element);
  };


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
      <div className="flex flex-col max-w-3/4 text-base font-medium self-start relative">
        {message.showName &&
        <div className="flex w-fit">
          <p className="text-text self-end font-light">{message.name}</p>
          <p className="text-text text-xs ml-3 self-end font-light pb-[2px]">{formattedTime}</p>
        </div>
        }
        <div ref={messageRef}>
          <div className={`mb-2 w-fit rounded-lg border border-2 border-gray-400/20 px-4 py-2 bg-secondary relative`} onContextMenu={HandleRightClick} ref={setRefs}>
            <div className="text-left flex flex-col text-pretty break-all">
              {isHovered && (
                <div ref={hoverRefs.setFloating} style={hoverStyles}>
                <MessageOptions sentByUser={false} 
                message={message} // Pass the message to the options
                setEditing={null}
                setEditingMessage={null}
                setIsDropdownOpen={toggleDropdown}
                />
                </div>
              )}
              <Content message={message}/>
              {message.isEdited==1 && (<p className="text-right text-xs font-light text-gray-400 select-none">edited</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SystemMessage({ message }) {
  const isToday = new Date(message.timestamp).toDateString() === new Date().toDateString();
  const isYesterday = (() => {const yesterday = new Date();yesterday.setDate(new Date().getDate() - 1);return new Date(message.timestamp).toDateString() === yesterday.toDateString()})();
  const formattedTime = 
    isToday ? `${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : isYesterday ? `Yesterday at ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`
            : `${String(new Date(message.timestamp).getDate()).padStart(2, '0')}/${String(new Date(message.timestamp).getMonth() + 1).padStart(2, '0')} ${String(new Date(message.timestamp).getHours()).padStart(2, '0')}:${String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}`;

  return(
    <div className={`flex flex-col w-full`}>
    {message.isNewDay && (
      <div className="flex items-center my-4">
        <div className="flex-grow border-t text-gray-400/50"></div>
        <span className="px-4 text-sm text-gray-500 whitespace-nowrap select-none">
          {new Date(message.timestamp).toLocaleDateString(undefined, {day: 'numeric',month: 'long',year: 'numeric',})}
        </span>
        <div className="flex-grow border-t text-gray-400/50"></div>
      </div>
    )}
    <div className="flex items-center justify-center min-h-8 my-2">
      <p className="text-text font-light">{message.content}</p>
    </div>
    </div>
  )
}





function Message({ messageContent , userID , mode, setEditing, setEditingMessage, editingMessage, boundaryRef}) {
  //const [message,setMessage]=useState(messageContent);
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const sentByUser = parseInt(messageContent.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  const isSystem = messageContent?.isSystem ?? false;
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to track the open dropdown
  const [messageToHide, setMessageToHide] = useState(null); // State to store the message to be hidden
  const [isHideModalOpen, setIsHideModalOpen] = useState(false); // State to control the hide modal

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      if (prev) {setTimeout(() => setDropdownOpen(false), 0);return prev;} //Close 1 Render Later (Stops dismiss instantly refiring this)
      else{return true} //Open immediately otherwise
    });
  };

  // Set up floating ui
  const { refs: dropdownRefs, floatingStyles: dropdownStyles, context } = useFloating({
    placement: "top-end",
    middleware: [offset(-2),flip(),shift({ boundary: boundaryRef.current})],
    whileElementsMounted: autoUpdate,
    open: isDropdownOpen,
    onOpenChange: toggleDropdown
  }); 


  useDismiss(context, {
    outsidePressEvent: "pointerup", // Can be "pointerdown" too
    bubbles: true,
    trees: true,
    onDismiss: () => dismiss,
  });



  

  const openHideModal = (messageID) => {
    setMessageToHide(messageID); // Set the message to be hidden
    setIsHideModalOpen(true); // Open the modal
  };

  const closeHideModal = () => {
    setMessageToHide(null); // Clear the message
    setIsHideModalOpen(false); // Close the modal
  }

  return (
    
    <>

      {
      isSystem?
      <SystemMessage message={messageContent}/>
      :
      sentByUser ? 
      <SelfMessage message={messageContent}
      setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} toggleDropdown={toggleDropdown} dropdownRefs={dropdownRefs} SetisHovered={SetisHovered} isHovered={isHovered}/> 
      : <OtherMessage message={messageContent} toggleDropdown={toggleDropdown} dropdownRefs={dropdownRefs} SetisHovered={SetisHovered} isHovered={isHovered}/>}
        {isDropdownOpen && (
        <ChatDropdown
          sentByUser={sentByUser}
          onClose = {()=> {toggleDropdown(null); SetisHovered(false)}}
          message={messageContent} // Pass the message to the dropdown
          setEditing={sentByUser ? setEditing : null}
          setEditingMessage={sentByUser ? setEditingMessage : null}
          openHideModal={() => openHideModal(messageContent.messageID)} // Pass the function to open the modal with the message ID
          refs={dropdownRefs} 
          floatingStyles={dropdownStyles}
        />
        )}
        {isHideModalOpen && (
          <HideMessageModal
            open={isHideModalOpen}
            onClose={closeHideModal}
            messageID={messageToHide}
            mode={mode} // Pass the mode to the modal
          />
        )}
    </>

  );
}

export default Message;