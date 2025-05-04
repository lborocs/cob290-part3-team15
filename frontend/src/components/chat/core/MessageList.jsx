import Message from "../Message";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

function MessageList({userID, selectedID, mode, refresh, setMessagesLoaded ,messageContainerRef, setEditing, setEditingMessage, editingMessage, editedValue}) {
  const [messages, setMessages] = useState([]);
  const boundaryRef = useRef(null); 
  
  const getMessages = async() => {
    //Actual API request
    try{
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(`/api/chat/${mode}/getMessages?target=${selectedID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
      if (response?.data?.results){
        setMessagesLoaded(Date.now());
        // Hide name if back-to-back messages are from the same user
        const messagesWithShowName = response.data.results.map((message, index, arr) => {
          const showName = (index === 0 || (message.user !== arr[index - 1].user) || (new Date(message.timestamp) - new Date(arr[index - 1].timestamp)) > (20 * 60 * 1000));
          const isNewDay = (index === 0 || new Date(message.timestamp).toDateString() !== new Date(arr[index - 1].timestamp).toDateString());
          return {...message,showName:showName,isNewDay:isNewDay};
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
            const showName = (index === 0 && message.user === lastMessageOwner) ? 
            ((new Date(message.timestamp) - new Date(lastMessageTimestamp)) > (20 * 60 * 1000)) : 
            (index === 0 || (message.user !== arr[index - 1].user) || (new Date(message.timestamp) - new Date(arr[index - 1].timestamp)) > (20 * 60 * 1000))
            return {
              ...message,showName:showName,isNewDay:false};
          });
          setMessages(prevMessages => [...prevMessages, ...newMessages]);
        }
      }
      else{
        getMessages()
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
        return { ...message, content: editedValue.content,isEdited:1 };
      }
      return message;
    });
    setMessages(updatedMessages);
  }

  //Onload
  useEffect(()=>{
    setEditing(false);
    setEditingMessage(null);
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
    <div className="flex flex-col max-w-[max(1500px,100%)] w-[min(1500px,100%)] self-center px-auto" ref={boundaryRef}>
        {messages.map((message) => (
            <Message key={message.messageID} messageContent={message} userID={userID} mode={mode} setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} boundaryRef={boundaryRef}/>
        ))}
    </div>
  );
}

export default MessageList;