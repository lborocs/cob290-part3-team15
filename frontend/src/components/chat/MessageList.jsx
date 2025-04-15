import Message from "./Message";
import axios from "axios";
import { useState, useEffect } from "react";

function MessageList({userID, selectedID, mode, refresh, messageContainerRef, setEditing, setEditingMessage, editingMessage, editedValue}) {
  const [messages, setMessages] = useState([]);

  const getMessages = async() => {
    //Actual API request
    try{
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(`/api/chat/${mode}/getMessages?target=${selectedID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
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

  const getNewMessages = async() => {
    //Actual API request
    try{
      const accessToken = localStorage.getItem('accessToken');
      const lastMessageTimestamp = messages.slice(-1)[0]?.timestamp || null;
      if(lastMessageTimestamp){
        const response = await axios.get(`/api/chat/${mode}/getMessagesAfter?target=${selectedID}&after=${encodeURIComponent(lastMessageTimestamp)}`,{headers: { Authorization: `Bearer ${accessToken}` }});
        if (response?.data?.results){
          //Hide name if back-to-back messages are from the same user
          const lastMessageOwner = messages.slice(-1)[0]?.user || null;
          const newMessages = response.data.results.map((message, index, arr) => {
            const showName = (index === 0 && message.user === lastMessageOwner) ? false : (index === 0 || message.user !== arr[index - 1].user || message.user === userID);
            return {
              ...message,showName,};
          });
          setMessages(prevMessages => [...prevMessages, ...newMessages]);
        }
      }
    }
    catch (error) {
      // Empty as we log errors in the request response
    }
  }

  const editValue = () => {
    //Find message with corresponding messageID and modify the content
    const updatedMessages = messages.map((message) => {
      if (message.messageID === editedValue.messageID) {
        return { ...message, content: editedValue.content };
      }
      return message;
    });
    setMessages(updatedMessages);
  }

  //Onload
  useEffect(()=>{
    getMessages();
  }, [selectedID,mode])

  //Full Refresh handler
  useEffect(()=>{
    getNewMessages();
  }, [refresh])

  //Edit Refresh handler
  useEffect(()=>{
    editValue();
  }, [editedValue])

  useEffect(()=>{
    if (messageContainerRef.current) messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages])


  
  
  return (
    <div className="flex flex-col px-30">
        {messages.map((message) => (
            <Message key={message.messageID} messageContent={message} userID={userID} mode={mode} setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage}/>
        ))}
    </div>
  );
}

export default MessageList;