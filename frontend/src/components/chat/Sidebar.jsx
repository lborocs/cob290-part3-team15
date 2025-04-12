import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdClose } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

import CreateChat from './CreateChat.jsx';
import ProfileCard from '../accounts/ProfileCard.jsx';
import LeaveDropdown from './LeaveDropdown.jsx';

const Sidebar = ({userID,mode,setMode,selectedID,setSelectedID,refresh}) => {

  const [chats,setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Checks if the dropdown is open
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const timeFormat = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const today = now.toDateString() === date.toDateString();

    if (today) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
  };
  

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
  
  //Anti Right Click for dropdown

  // Close dropdown when clicking outside of it
  const closeDropdown = () => { // Copied from message options
    setIsDropdownOpen(false); // Close the dropdown
  };

  const HandleRightClick = (event) => {
    event.preventDefault();
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility, i.e from open to close and vice versa
  };




  return (
    <>
      {/*Top part*/}
      <div className="flex justify-between items-center mt-8 h-10" onContextMenu={HandleRightClick}>
        <p className="font-extrabold text-[28px] ml-6 w-full text-left text-text select-none">Messages</p>
      </div>
      <div className="flex justify-between mt-2 h-11 pl-2" onContextMenu={HandleRightClick}>
        <div className="flex items-end ml-3 gap-2 mb-[2px]">
          <MdGroup className="w-10 h-7 text-text/70 align-bottom"/>
          <p className="font-bold text-[18px] h-7 text-text w-full text-left select-none">{chats.length} Chat{chats.length>1 ?  "s" :""}</p>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex justify-center items-center bg-accentOrange hover:bg-orangeHover border-1 border-black/20 w-10 h-10 rounded-full mr-2">
            <p className="text-text font-bold">?</p>
          </div>
          <div className="flex justify-center items-center bg-accentOrange hover:bg-orangeHover border-1 border-black/20 w-10 h-10 rounded-full mr-2">
            <CreateChat userID={userID}/>
          </div>
        </div>
      </div>

      <hr className="border-black/20 w-[95%] h-[1px] mt-1 mb-3 mx-auto" onContextMenu={HandleRightClick}/>
      {/*Chat Search*/}
      <div className="flex justify-center w-full h-8 shrink-0" onContextMenu={HandleRightClick}>
        <div className="flex items-center border-1 w-[90%] h-full bg-white border-blackFaded rounded-full focus-within:outline-none focus-within:ring-1 shadow-sm px-2">
          <FaSearch className="w-6 h-6 text-text/90"/>
          <input type="text" placeholder="Search" className="h-8 p-2 text-[16px] text-text w-full focus:outline-none" onChange={(e) => setSearchTerm(e.target.value)}onKeyDown={(e) => {if (e.key === 'Enter') {e.target.blur()}}}/>
        </div>
      </div>

      {/*Chat List*/}
      <div className="flex flex-col h-full px-2 space-y-2 overflow-y-auto pb-5 pt-4" onContextMenu={HandleRightClick}>
        {filteredChats.map((chat) => (
          <div key={`${chat.target}-${chat.type}`} className={`flex justify-center items-center ${selectedID===chat.target && mode===chat.type ? "bg-orangeHover":"bg-accentOrange hover:bg-orangeHover"} rounded-xl h-20 gap-2 group`}>
            <button className="flex w-full h-full pt-1 pl-2 pr-1 text-text rounded"
              onClick={() => {setSelectedID(chat.target); setMode(chat.type)}}>
              <div className="w-15 h-15 my-auto">
                  <ProfileCard displayBG={selectedID===chat.target && mode===chat.type ? "bg-orangeHover":"bg-accentOrange hover:bg-orangeHover"} type={chat.type === "group_messages" ? "Group" : "" } id={chat.target}/>
              </div>
              <div className="flex flex-1 flex-col justify-start h-full pl-2 relative">
                <div className="flex flex-col w-full justify-start">
                  <p className="font-extrabold text-text max-w-40 w-full text-[18px] text-left truncate">{chat.name}</p>
                  <p className="font-normal text-text max-w-40 text-[16px] text-left truncate">{chat.content}</p>
                  <p className="text-text text-sm absolute bottom-0 right-0 pr-2 pb-1 group-hover:hidden">{timeFormat(chat.timestamp)}</p>
                </div>
              </div>
            </button>

            {/*Hover stuff*/}
            <button className="flex h-full w-10 text-text justify-center hidden group-hover:block items-center" onClick={() => {deleteChat(chat.target,chat.type)}}><MdClose className="w-8 h-8"/></button>
            {isDropdownOpen && ( // Dropdown menu for right click options
              <LeaveDropdown onClose={closeDropdown}/>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col mt-4" onContextMenu={HandleRightClick}></div> {/*Bottom Area, basically just padding atp*/}
    </>
  );
};

export default Sidebar;
