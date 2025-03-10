import {BsSend} from 'react-icons/bs';
import { useState } from 'react';

function MessageBox() {
  
  // Initialize use state, which contains the inital state and the function to update the state
  const [message, SetMessage] = useState("");
  // Update handler function
  const handleMessageChange = (newMessage) => {
    SetMessage(newMessage); // Updates the message state upon changing the textfield
  }

  // onSubmit function
  const onSubmit = () => {
    if (message===""){
      return 
    }
    console.log(message);
    SetMessage(""); // Clear the message box
  }
  return (
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="message_box" value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter message" />
        <button type="submit" className="btn btn-primary" id="submit_message_button" onClick={onSubmit}><BsSend/></button>
    </div>
  );
}

export default MessageBox;