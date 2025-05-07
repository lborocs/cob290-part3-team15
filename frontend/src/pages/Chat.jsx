// Client socket
import { connectSocket, disconnectSocket,getSocket } from '../socket';

import {useWindowSize,useWindowWidth,useWindowHeight} from '@react-hook/window-size'
import { BsArrowBarLeft, BsX } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
import { useState,useEffect,useRef } from 'react';
 
import MessageList from '../components/chat/core/MessageList.jsx';
import MessageBox from '../components/chat/core/MessageBox.jsx';

import Sidebar from '../components/chat/core/Sidebar.jsx';
import Navbar from '../components/navigation/Navbar.jsx';
import Auth from "../components/login/Auth.jsx";
import Header from '../components/chat/MessageHeader.jsx';

import chatBackground from '../assets/chat_background.png';

function Chat({ user }){
    const messageContainerRef = useRef(null);
    const windowWidth = useWindowWidth();
    const [hasResetSidebar, setHasResetSidebar] = useState(false);
    // Editing
    const [editing, setEditing] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null); // Store the message being edited (also needs to be passed down the hierarchy)
    //Edit Refresh Variables
    const [editedValue,setEditedValue]=useState(null);

    //Navbar
    const [selectable,setSelectable] = useState(windowWidth<1024);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const activeTab="Chat"

    //Sidebar
    const containerRef = useRef(null);

    //Socket
    const [refresh,setRefresh] = useState(0)
    const [newNotification,setNewNotification] = useState(0);
    const [messagesLoaded,setMessagesLoaded]= useState(null);
    const [otherStatus,setOtherStatus] = useState(null);
    const [personalStatus,setPersonalStatus] = useState("Offline");

    //Communication IDs
    const userID = user.userID;
    const role = user.role;
    const name = user.name;

    //Page specific State (Saves)
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('selectedMode');
        return saved ? saved : 'direct_messages'
    });

    //Selected mode handler
    useEffect(() => {
        localStorage.setItem('selectedMode', mode);
    }, [mode]);

    //Selected ID (Saves)
    const [selectedID, setSelectedID] = useState(() => {
        const saved = localStorage.getItem('selectedID');
        return saved ? parseInt(saved) : -1
    });

    //SelectedID handler
    useEffect(() => {
        localStorage.setItem('selectedID', selectedID);
    }, [selectedID]);

    //Chat name (Saves)
    const [chatName, setName] = useState(() => {
        const saved = localStorage.getItem('chatName');
        return saved ? saved : ''
    });

    //Chat name handler
    useEffect(() => {
        localStorage.setItem('chatName', chatName);
    }, [chatName]);

    //Anti Right Click (Make a copy for the dropdown menu, this is general purpose)
    const HandleRightClick = (event) => {
        event.preventDefault();
    };

    //On window width resize
    useEffect(() => {
        //If the screen is small and you can reset the sidebar, reset it
        if (windowWidth < 1024 && !hasResetSidebar) {
            setSidebarVisible(true);
            setHasResetSidebar(true);
            setSelectable(true);
        } 
        //Reset becomes available if large again
        else if (windowWidth >= 1024 && hasResetSidebar) {
            setHasResetSidebar(false);
            setSidebarVisible(true);
            setSelectable(false);
        }
    }, [windowWidth]);

    const setSidebarVisibleSmallScreen = () => {
        if (windowWidth < 1024) {
            setSidebarVisible(false);
        } 
    }

    useEffect(() => {
        connectSocket();
        const socket = getSocket();
    
        // Setup listeners early, before any emit
        if (socket) {
            socket.on('selfStatus', (data) => {
                if (!data || Object.keys(data).length === 0) return;
                setPersonalStatus(data?.status);
            });
            socket.on('otherStatus', (data) => { 
                setOtherStatus(data);
            });
    
            socket.on('newMessage', (data) => { //NOTE - This is suitable, a lot of data needs to be double checked here
                setRefresh(previous => previous + 1);
            });

            socket.on('editMessage', (data) => { //NOTE - If the active message list is the one being edited.. AND ONLY in this situation refresh. Include a timestamp to make it "unique" each time
                attemptToSetEditedValue(data);
            });

            socket.on('notification', (data) => { 
                attemptToSetNotification(data);
            }); 

            socket.emit('requestStatus');
            
        }
    
        return () => {
            socket.off('selfStatus');
            socket.off('otherStatus');
            socket.off('newMessage');
            socket.off('editMessage');
            socket.off('notification');
            disconnectSocket(); //Disconnects when not on /chat or /analytics

        };
    }, []);


    //EDITED MESSAGE SECTION 

    //ITS STATIC... I HAVE TO USE REFERENCES.....
    const selectedIDRef = useRef();
    const modeRef = useRef();

    useEffect(() => {
        selectedIDRef.current = selectedID;
    }, [selectedID]);

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    const attemptToSetEditedValue = (data) => {
        if (data.targetID===selectedIDRef.current && data.targetID!==null && data.type===modeRef.current) { 
            setEditedValue(data);
    }}

    const attemptToSetNotification = (data) => {
        if (data.target===selectedIDRef.current && data.target!==null && data.type===modeRef.current){
        }
        else{
            setNewNotification(previous => previous+1);
        }
    }

    return(
        //Full container
        <div className="flex h-screen w-screen relative">
            {/*Leftmost Sidebar (For tab switching) : Never changes */}
            <Navbar userID = {userID} selectable={selectable} isSelected={sidebarVisible} setIsSelected={setSidebarVisible} activeTab={activeTab} status={personalStatus} newNotification={newNotification} refreshNotifications={messagesLoaded}/>

            {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
            <div className="flex flex-1 max-w-[calc(100%-72px)] relative">
                {sidebarVisible ? 
                <div className={`flex flex-col h-full fixed lg:static bg-backgroundOrange border-r-1 border-black/20 sm:flex:1 sm:w-[300px] w-[calc(100%-72px)] z-10`} onContextMenu={HandleRightClick} ref={containerRef}> 
                    {/*<button className="lg:hidden mt-2 mr-2 ml-auto p-0 border-2 border-white bg-transparent w-[60px] h-[60px] z-20" onClick={(e) => setSidebarVisible(false)}><BsArrowBarLeft className="w-[30px] h-[30px]"/></button>*/}
                    <Sidebar userID = {userID} mode={mode} setMode={setMode} selectedID={selectedID} setSelectedID={setSelectedID} refresh={refresh} statusUpdate={otherStatus} containerRef={containerRef} setName={setName} setSidebarVisible={setSidebarVisibleSmallScreen}/>
                </div>
                :<></>}
                
                {/*Main Chat Area*/}
                <div className={`${!sidebarVisible ? "block" : "hidden sm:block" } flex flex-col flex-1 h-auto relative max-w-full bg-cover bg-center`} style={{ backgroundImage: `url(${chatBackground})` }} onContextMenu={HandleRightClick}>
                    {/* <div className="bg-accentWhite w-full h-[100px]">User:{name} Role:{role}</div> */}
                    <Header name={chatName} mode={mode} selectedID={selectedID} userID={userID} />
                    <div className="flex flex-col flex-1 h-[calc(100%-60px)] min-h-[calc(100%-60px)] max-h-[calc(100%-60px)] max-w-full">
                        <div className="flex flex-col flex-1 max-h-full w-full overflow-y-scroll" ref={messageContainerRef}>
                            <MessageList userID = {userID} selectedID={selectedID} mode={mode} refresh={refresh} setMessagesLoaded={setMessagesLoaded} messageContainerRef={messageContainerRef} setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} editedValue={editedValue}/>
                        </div>
                        <div className="flex flex-col bg-transparent justify-center shadow-md overflow-y-scroll scrollbar-transparent" >
                            <MessageBox userID = {userID} selectedID={selectedID} mode={mode} editing={editing} editingMessage={editingMessage} setEditingMessage={setEditingMessage} setEditing={setEditing}/>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default Auth(Chat)