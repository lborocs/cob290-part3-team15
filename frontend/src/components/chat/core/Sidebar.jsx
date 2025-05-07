import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdClose } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

import CreateChat from '../CreateChat.jsx';
import ProfileCard from '../../accounts/ProfileCard.jsx';
import LeaveDropdown from '../LeaveDropdown.jsx';
import LeaveModal from '../LeaveModal.jsx';

const Sidebar = ({userID,mode,setMode,selectedID,setSelectedID,refresh,statusUpdate,containerRef,setName,setSidebarVisible}) => {
  const [chats,setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownChat, setDropdownChat] = useState(null); // Stores the chat for the dropdown
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [chatToLeave, setChatToLeave] = useState(null); // Stores the chat to leave
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
        const adjustedChats = response.data.results.map(chat => {
          if (chat.target === selectedID && chat.type === mode) {
            return { ...chat, notifications: 0 }; //Force to 0, selected screen already
          }
          return chat;
        });
        setChats(adjustedChats);
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

  //Status Update
  useEffect(()=>{
    if (!statusUpdate) return;
    if (!statusUpdate?.target || !statusUpdate?.status) return;
    const idToFind= statusUpdate?.target; 
    const newStatus= statusUpdate?.status;
    setChats((prevChats) => {
      return prevChats.map(chat => {
        // key is id-direct_messages
        if (chat.target === idToFind && chat.type === "direct_messages") {
          return { ...chat, status: newStatus };
        }
        else{console.log(chat.target ,"-", chat.type, " ", idToFind,"-", "direct_messages")}
        return chat;
      });
    });
  }, [statusUpdate])

  //Anti Right Click for dropdown

  // Close dropdown when clicking outside of it
  const closeDropdown = () => {
    setDropdownChat(null);
  };

  const HandleRightClick = (event, chat) => {
    event.preventDefault();
    const container = containerRef.current?.getBoundingClientRect();
    setDropdownChat({target: chat.target, type: chat.type, position: {x: event.clientX-container.left, y:event.clientY-container.top}}); // Set the clicked on chat for the dropdown
  };



  return (
    <>
      {/*Top part*/}
      <div className="flex justify-between items-center mt-8 h-10">
        <p className="font-extrabold text-[28px] ml-6 w-full text-left text-text select-none">Messages</p>
      </div>
      <div className="flex justify-between mt-2 h-11 pl-2">
        <div className="flex items-end ml-3 gap-2 mb-[2px]">
          <MdGroup className="w-10 h-7 text-text/70 align-bottom"/>
          <p className="font-bold text-[18px] h-7 text-text w-full text-left select-none">{chats.length} Chat{chats.length>1 ?  "s" :""}</p>
        </div>
        <div className="flex flex-row items-center">
          {/*<div className="flex justify-center items-center bg-accentOrange hover:bg-orangeHover border-1 border-black/20 w-10 h-10 rounded-full mr-2">
            <p className="text-text font-bold">?</p>
          </div>*/}
          <div className="flex justify-center items-center bg-accentOrange hover:bg-orangeHover border-1 border-black/20 w-10 h-10 rounded-full mr-2">
            <CreateChat userID={userID} setSelectedID={setSelectedID} setMode={setMode}/>
          </div>
        </div>
      </div>

      <hr className="border-black/20 w-[95%] h-[1px] mt-1 mb-3 mx-auto" />
      {/*Chat Search*/}
      <div className="flex justify-center w-full h-8 shrink-0" >
        <div className="flex items-center border-1 w-[90%] h-full bg-white border-blackFaded rounded-full focus-within:outline-none focus-within:ring-1 shadow-sm px-2">
          <FaSearch className="w-6 h-6 text-text/90"/>
          <input type="text" placeholder="Search" className="h-8 p-2 text-[16px] text-text w-full focus:outline-none" onChange={(e) => setSearchTerm(e.target.value)}onKeyDown={(e) => {if (e.key === 'Enter') {e.target.blur()}}}/>
        </div>
      </div>

      {/*Chat List*/}
      <div className="flex flex-col h-full px-2 space-y-2 overflow-y-auto pb-5 pt-4" >
        {filteredChats.map((chat) => (
          <div key={`${chat.target}-${chat.type}`} className={`flex justify-center items-center ${selectedID===chat.target && mode===chat.type ? "bg-orangeHover":"bg-accentOrange hover:bg-orangeHover"} rounded-xl h-20 gap-2 group`} onContextMenu={(e) => HandleRightClick(e,chat)}>
            <button className="flex w-full h-full pt-1 pl-2 pr-1 text-text rounded"
              onClick={() => {setSelectedID(chat.target); setMode(chat.type); setName(chat.name);setSidebarVisible(false);setChats(prevChats => prevChats.map(c =>c.target === chat.target && c.type === chat.type? { ...c, notifications: 0 }: c));}}>
              <div className="w-15 h-15 my-auto">
                  <ProfileCard displayBG={selectedID===chat.target && mode===chat.type ? "bg-orangeHover":"bg-accentOrange group-hover:bg-orangeHover"} type={chat.type === "group_messages" ? "Group" : "" } id={chat.target} status={chat.status}/>
              </div>
              <div className="flex flex-1 flex-col justify-start h-full pl-2 relative">
                <div className="flex flex-col w-full justify-start">
                  <p className="font-extrabold text-text group-hover:max-w-37 max-w-50 w-full text-[18px] text-left truncate">{chat.name}</p>
                  <p className="font-normal text-text group-hover:max-w-37 max-w-50 text-[16px] text-left truncate">{chat.content}</p>
                  {chat.notifications>0?
                  <div className={`group-hover:hidden right-0 absolute font-bold w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white ${ chat.notifications<99? "text-[14px]" : "text-[11px]"}`}>
                    <p className="w-full text-center pr-[1px]">{ chat.notifications<99? chat.notifications : "99+"}</p>
                  </div>
                  :<></>
                  }
                  <p className={`absolute bottom-0 right-0 group-hover:hidden text-text text-sm pr-2 pb-1 ${chat.notifications>0?"font-bold":""}`}>{timeFormat(chat.timestamp)}</p>
                </div>
                
              </div>
            </button>

            {/*Hover stuff*/}
            <button className="flex h-full w-10 text-text justify-center hidden group-hover:block items-center" onClick={() => {setChatToLeave (chat); setShowLeaveModal(true);}}><MdClose className="w-8 h-8"/></button>
            {dropdownChat?.target == chat.target && dropdownChat?.type == chat.type && ( // Dropdown menu for right click options
              <LeaveDropdown onClose={closeDropdown} leaveFunction={() => {deleteChat(chat.target,chat.type)}} position={dropdownChat.position} setShowLeaveModal={setShowLeaveModal}/>
              
            )}
          </div>
        ))}
      </div>
      {showLeaveModal && chatToLeave && ( // Leave chat modal
        <LeaveModal open={showLeaveModal} onClose={() => {setShowLeaveModal(false); setChatToLeave(null)}} leaveFunction={() => {deleteChat(chatToLeave.target,chatToLeave.type)}} closeDropdown={closeDropdown}/>
      )}

      <div className="flex flex-col mt-4"></div> {/*Bottom Area, basically just padding atp*/}
    </>
  );
};

export default Sidebar;
