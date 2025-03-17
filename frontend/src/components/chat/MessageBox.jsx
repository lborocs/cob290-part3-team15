import {BsSend} from 'react-icons/bs';
import { useState } from 'react';
import axios from "axios";

function MessageBox({userID, selectedID, mode}) {
  
  // Initialize use state, which contains the initial state and the function to update the state
  const [message, setMessage] = useState("");
  // Update handler function
  const handleMessageChange = (newMessage) => {
    setMessage(newMessage); // Updates the message state upon changing the text field
  }

  // onSubmit function
  const onSubmit = async() => {
    if (message===""){
      return
    }

    //Actual API request
    try{
      const accessToken = localStorage.getItem('accessToken');
      const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
      const body = {id:userID,target:selectedID,text:message,};
      const response = await axios.post(`/api/chat/${mode}/sendMessage`, body, headers);
      if (response?.data?.success){
        setMessage("");
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