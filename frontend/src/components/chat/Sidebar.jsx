import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdClose } from "react-icons/md";

import CreateChat from './CreateChat.jsx';

const Sidebar = ({userID,mode,setMode,selectedID,setSelectedID,refresh}) => {

  const [chats,setChats] = useState([]);
  

  const getChats = async() => {
    try{
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await axios.get(`/api/chat/getChats?id=${userID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
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
      <p className="font-bold text-lg">Messages</p>
      <CreateChat userID={userID}/>
      <div className="flex flex-col pl-2 pr-1 space-y-2">
        {chats.map((chat) => (
          <div key={`${chat.target}-${chat.type}`} className="flex justify-center items-center bg-blackFaded hover:bg-black/30">
          <button
            className="flex flex-1 p-2 text-white rounded self-center "
            onClick={() => {setSelectedID(chat.target); setMode(chat.type)}}
          >
            {chat.name}
          </button>
          <button className="h-full w-10 text-primary hover:text-red-400"
            onClick={() => {console.log("CLOSE")}}
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
