import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdClose } from "react-icons/md";

import CreateChat from './CreateChat.jsx';

const Sidebar = ({userID,mode,setMode,selectedID,setSelectedID,refresh}) => {

  const [chats,setChats] = useState([]);
  

  const getChats = async() => {
    try{
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await axios.get(`/api/chat/getChats`, {headers: { Authorization: `Bearer ${accessToken}` }});
      if (response?.data?.results){
          setChats(response.data.results);
      } 
      else {
          setChats([]);
      }
    }
    catch (error) {
      setChats([]);
    }
  }

  const deleteChat = async(target,type) => {
    try{
      const accessToken = localStorage.getItem('accessToken');
      const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}
      const body = {target:target,type:type,};
      const response = await axios.delete('/api/chat/removeChat', { headers:headers, data: body });
      if (response?.data?.success){
        setChats((prevChats) => {
          return prevChats.filter(chat => !(chat.target === target && chat.type === type));
        });
      }
    }
    catch (error) {//Already Handled
    }
  }
  
  

  //On Load, Fetch all chats
  useEffect(()=>{
    getChats();
  }, [])

  //Been told to refresh, new message!
  useEffect(()=>{
    getChats();
  }, [refresh])





  return (
    <>
      <div className="relative justify-center mt-8 h-10">
        <p className="font-bold text-lg">Messages</p>
        <CreateChat userID={userID}/>
      </div>
      <div className="flex flex-col flex-1 pl-2 pr-1 space-y-2 overflox-scroll">
        {chats.map((chat) => (
          <div key={`${chat.target}-${chat.type}`} className="flex justify-center items-center bg-blackFaded hover:bg-black/30">
          <button
            className="flex flex-1 p-2 text-white rounded self-center "
            onClick={() => {setSelectedID(chat.target); setMode(chat.type)}}
          >
            {chat.name}
          </button>
          <button className="h-full w-10 text-primary hover:text-red-400"
            onClick={() => {deleteChat(chat.target,chat.type)}}
          ><MdClose className="w-8 h-8"/></button>
          </div>
        ))}
      </div>

      <div className="flex flex-col mt-4">
        {/* Display selected user */}
        {selectedID !== null ? (
          <p>User: {selectedID}</p>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Sidebar;
