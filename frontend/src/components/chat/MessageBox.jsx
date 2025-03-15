import {BsSend} from 'react-icons/bs';
import { useState } from 'react';
import axios from "axios";

function MessageBox({userID, selectedID, mode}) {
  
  // Initialize use state, which contains the initial state and the function to update the state
  const [message, SetMessage] = useState("");
  // Update handler function
  const handleMessageChange = (newMessage) => {
    SetMessage(newMessage); // Updates the message state upon changing the text field
  }

  // onSubmit function
  const onSubmit = async() => {
    if (message===""){
      return
    }

    let route = "/postTeapot"
    //This is messy but I guess it works
    if (mode === 'direct_messages'){
      route='chat/sendDirectMessage';
    }
    else{
      console.error("Mode Not Found")
    }

    //Actual API request
    try{
      const headers = {headers: {'Content-Type': 'application/json',}}
      const body = {id:userID,target:selectedID,text:message,};
      const response = await axios.post(`/api/${route}`, body, headers);
      if (response?.data?.success){
        SetMessage("");
      }
      else{
        console.error("Message failed to send");
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="message_box" value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter message" />
        <button type="submit" className="btn btn-primary" id="submit_message_button" onClick={onSubmit}><BsSend/></button>
    </div>
  );
}

export default MessageBox;