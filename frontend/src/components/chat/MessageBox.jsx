import {BsSend} from 'react-icons/bs';
import { useState,useRef } from 'react';
import axios from "axios";

function MessageBox({userID, selectedID, mode}) {
  const ref = useRef(null);
  // Initialize use state, which contains the initial state and the function to update the state
  const [message, setMessage] = useState("");
  // Update handler function
  const handleMessageChange = (newMessage) => {
    setMessage(newMessage); // Updates the message state upon changing the text field
  }

  // onSubmit function
  const onSubmit = async(e) => {
    e.preventDefault();
    
    if (message===""){
      return
    }
    ref.current.blur();
    //Actual API request
    try{
      const accessToken = localStorage.getItem('accessToken');
      const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
      const body = {target:selectedID,text:message,};
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
    <form className="form-group d-flex justify-content-center" onSubmit={onSubmit}>
        <input type="text" className= "form-control" id="message_box" ref={ref} value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter message" />
        <button type="submit" className="btn btn-primary" id="submit_message_button" onClick={onSubmit}><BsSend/></button>
    </form>
  );
}

export default MessageBox;