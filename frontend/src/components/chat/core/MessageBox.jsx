import {BsSend} from 'react-icons/bs';
import { useState,useRef, useEffect } from 'react';
import axios from "axios";

function MessageBox({userID, selectedID, mode, editing, setEditing, setEditingMessage, editingMessage}) {
  const ref = useRef(null);
  // Initialize use state, which contains the initial state and the function to update the state
  const [message, setMessage] = useState("");
  // Update handler function
  const handleMessageChange = (newMessage) => {
    setMessage(newMessage); // Updates the message state upon changing the text field
  }
  useEffect(() => {
    if (editing){
      //If editing, set the message to the message being edited
      setMessage(editingMessage.content);
    }
  },[editing, editingMessage]);
  // onSubmit function
  const onSubmit = async(e) => {
    e.preventDefault();
    if (editing){
      if (message !== "" && message !== editingMessage.content) {
        // If editing, make an API call to update the message
        try {
          // Make an api call to update the message content
          const accessToken = localStorage.getItem('accessToken');
          const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
          const body = {id: editingMessage.messageID, content: message};
          const response = await axios.put(`/api/chat/${mode}/updateMessage`, body, headers);
          if (response?.data?.success) {
            setEditing(false); // Set editing to false after submitting the message
            setEditingMessage(null); // Clear the message being edited
            setMessage(""); // Clear the message input field
            ref.current.blur(); // Remove focus from the input field
          } else {
              console.error("Failed to update message");
          }
        } catch (error) {
          console.error("Error updating message:", error);
        }
        return
      }
    }
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
    <form className="flex items-center gap-2 p-2 border border-gray-500 rounded-lg shadow-md bg-gray-500 focus-within:border-gray-400 transition w-full" onSubmit={onSubmit}>
        <input type="text" className= "flex-1 p-2 bg-transparent text-white focus:outline-none" id="message_box" ref={ref} value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter message" />
        <button type="submit" className="p-2 text-white rounded-full flex items-center" id="submit_message_button" onClick={onSubmit}><BsSend className="w-5 h-5 text-gray-300 hover:text-gray-400 transition-all"/></button>
    </form>
  );
}

export default MessageBox;