import {BsX} from 'react-icons/bs';
import {LuSendHorizontal} from "react-icons/lu";
import {useEffect, useRef, useState} from 'react';
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
    else{
      setMessage("");
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
            ref.current.focus()
          } else {
              console.error("Failed to update message");
          }
        } catch (error) {
          console.error("Error updating message:", error);
        }
        return
      }
      return
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
        ref.current.focus()
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
    <div className="max-w-[max(1550px,100%)] w-[min(1550px,100%)] bg-[#f2ede5]/80 px-5 lg:border-r-1 lg:border-l-1 pb-2 border-blackFaded self-center flex flex-col items-center">
    <form className="w-[min(1550px,100%)] self-center flex flex-col items-center border border-gray-400 rounded-lg shadow-md bg-accentWhite focus-within:border-gray-400 transition" onSubmit={onSubmit}>
        {editing && (
          <span className="flex justify-between items-center max-w-[max(1550px,100%)] w-[min(1550px,100%)] self-center p-1 rounded-t-lg bg-black/5">
            <div className="flex truncate">
              <p className="font-light px-2 text-text">Editing Message:</p>
              <p className="font-bold truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap pr-5 text-text">{editingMessage.content}</p>
            </div>
            <button
                className="mr-2 text-text hover:text-red-700"
                onClick={() => {
                    setEditing(false);
                    setEditingMessage(null);
                }}
                >
                <BsX className="text-2xl"/>
            </button>
          </span>
        )}
        <div className="flex max-w-[max(1550px,100%)] w-[min(1550px,100%)] p-2">
        <input type="text" className= "flex-1 p-2 bg-transparent text-text focus:outline-none max-w-[calc(100%-36px)]" 
        autoComplete="off" id="message_box" ref={ref} value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter message"
        onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();onSubmit(e)}}}/>
        <span className="flex items-center ">|</span>
        <button type="submit" className="p-2 rounded-full flex items-center" id="submit_message_button" onClick={onSubmit}><LuSendHorizontal className="w-5 h-5 text-gray-400 hover:text-gray-500 transition-all"/></button>
        </div>
    </form>
  </div>
  );
  
}

export default MessageBox;