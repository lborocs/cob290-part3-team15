import MessageOptions from './MessageOptions.jsx';
import { useState } from 'react';

function Content({ message }) {
  return (
    <>
      <div className="text-left w-fit">
          {message.content}
      </div>

    </>
  );
}

function SelfMessage({ message }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
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
    alert("Right-click is disabled on this page.");
  };
  return(
    <div className={`max-w-3/4 my-2 rounded-lg border border-2 border-blue-200 px-4 py-2 text-base font-medium self-end bg-blue-300`}onMouseEnter={HandleHover} onMouseLeave={HandleHover} onContextMenu={HandleRightClick}>
      <div className="self-start text-pretty break-all">
        {isHovered && <MessageOptions/>}
        <Content message={message}/>
      </div>
    </div>
  )
}

function OtherMessage({ message }) {
  const [isHovered, SetisHovered] = useState(false); // Default is not hovered
  const HandleHover = (e) => {
    if (e.type === 'mouseenter'){
      SetisHovered(true)
    } 
    else if (e.type === 'mouseleave'){
      SetisHovered(false)
    }
  };
  return(
    <div className="max-w-3/4 text-base font-medium self-start">
      {message.showName &&
      <div className="w-fit">
        {message.name}
      </div>
      }
      <div className={`mt-1 mb-2 rounded-lg border border-2 border-gray-400 px-4 py-2 bg-gray-500`}onMouseEnter={HandleHover} onMouseLeave={HandleHover}>
        <div className="text-left flex flex-col text-pretty break-all">
          {isHovered && <MessageOptions/>}
          <Content message={message}/>
        </div>
      </div>
    </div>
  )
}






function Message({ message , userID }) {
  const sentByUser = parseInt(message.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  return (
    <>
      {sentByUser ? <SelfMessage message={message} /> : <OtherMessage message={message} />}
    </>
  );
}

export default Message;