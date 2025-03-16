import Message from "./Message";
import axios from "axios";
import { useState, useEffect } from "react";

function MessageList({userID, selectedID, mode, refresh, messageContainerRef}) {
  const [messages, setMessages] = useState([]);
  

  const getMessages = async() => {
    let route = "/getTeapot"
    //This is messy but I guess it works
    if (mode === 'direct_messages'){
      route='chat/getDirectMessages';
    }
    else{
      console.error("Mode Not Found")
    }

    //Actual API request
    try{
      const response = await axios.get(`/api/${route}?id=${userID}&target=${selectedID}`);
      if (response?.data?.results){
        // Hide name if back-to-back messages are from the same user
        const messagesWithShowName = response.data.results.map((message, index, arr) => {
          const showName = (index === 0 || message.user !== arr[index - 1].user || message.user === userID);
          return {...message,showName,};
        });
        setMessages(messagesWithShowName);
      }
      else{
        setMessages(null);
      }
    }
    catch (error) {
      // Empty as we log errors in the request response
    }
  }

    //A use effect with [] at the end just gets instantly called on page load
  useEffect(()=>{
    getMessages();
  }, [selectedID,refresh])

  useEffect(()=>{
    if (messageContainerRef.current) messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages])


  
  
  return (
    <div className="flex flex-col">
        {messages.map((message) => (
            <Message key={message.messageID} message={message} userID={userID} />
        ))}
    </div>
  );
}

export default MessageList;