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
    const [otherStatusRefresh,setOtherStatusRefresh] = useState(0)
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

    useEffect(() => {
        connectSocket();
        const socket = getSocket();
    
        // Setup listeners early, before any emit
        if (socket) {
            socket.on('selfStatus', (data) => {
                setPersonalStatus(data?.status);
            });
            socket.on('otherStatus', (data) => { //REWORK NEEDED
                setRefresh(previous => previous + 1);
            });
    
            socket.on('newMessage', (data) => { //NOTE - This is suitable, a lot of data needs to be double checked here
                setRefresh(previous => previous + 1);
            });

            socket.on('editMessage', (data) => { //NOTE - If the active message list is the one being edited.. AND ONLY in this situation refresh. Include a timestamp to make it "unique" each time
                if (data?.targetID===selectedID && data?.targetID!==null && data?.type===mode) { 
                    setEditedValue(data);
                }
            });
            socket.emit('requestStatus', userID);
        }
    
        return () => {
            socket.off('selfStatus');
            socket.off('otherStatus');
            socket.off('newMessage');
            socket.off('editMessage');
            disconnectSocket(); //Disconnects when not on /chat or /analytics

        };
    }, []);

    return(
        //Full container
        <div className="flex h-screen w-screen relative">
            {/*Leftmost Sidebar (For tab switching) : Never changes */}
            <Navbar userID = {userID} selectable={selectable} isSelected={sidebarVisible} setIsSelected={setSidebarVisible} activeTab={activeTab} status={personalStatus}/>

            {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
            <div className="flex flex-1 relative">
                {sidebarVisible ? 
                <div className={`flex flex-col h-full fixed lg:static bg-backgroundOrange sm:flex:1 sm:w-[300px] w-[calc(100%-72px)] z-10`} onContextMenu={HandleRightClick} ref={containerRef}> 
                    {/*<button className="lg:hidden mt-2 mr-2 ml-auto p-0 border-2 border-white bg-transparent w-[60px] h-[60px] z-20" onClick={(e) => setSidebarVisible(false)}><BsArrowBarLeft className="w-[30px] h-[30px]"/></button>*/}
                    <Sidebar userID = {userID} mode={mode} setMode={setMode} selectedID={selectedID} setSelectedID={setSelectedID} refresh={refresh} containerRef={containerRef}/>
                </div>
                :<></>}
                
                {/*Main Chat Area*/}
                <div className={`${!sidebarVisible ? "block" : "hidden sm:block" } flex flex-col flex-1 h-auto relative`}>
                    <div className="bg-accentWhite w-full h-[100px]">User:{name} Role:{role}</div>
                    <div className="flex flex-col flex-1 bg-primary h-[calc(100%-100px)]">
                        <div className="flex flex-col flex-1 max-h-full w-full overflow-y-scroll" ref={messageContainerRef}>
                            <MessageList userID = {userID} selectedID={selectedID} mode={mode} refresh={refresh} messageContainerRef={messageContainerRef} setEditing={setEditing} setEditingMessage={setEditingMessage} editingMessage={editingMessage} editedValue={editedValue}/>
                        </div>
                        {editing && (
                            <div className="w-full bg-transparent text-black justify-center text-left rounded-lg px-30 z-5">
                                
                                <span className="flex items-center">
                                    <button
                                        className="mr-4 text-gray-500 hover:text-red-700"
                                        onClick={() => {
                                            setEditing(false);
                                            setEditingMessage(null);
                                        }}
                                        >
                                        <BsX/>
                                    </button>
                                    Editing Message: {editingMessage.content}
                                </span>
                                
                            </div>
                        )}
                        <div className="flex flex-col bg-transparent h-20 justify-center px-4 shadow-md px-30">
                            <MessageBox userID = {userID} selectedID={selectedID} mode={mode} editing={editing} editingMessage={editingMessage} setEditingMessage={setEditingMessage} setEditing={setEditing}/>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default Auth(Chat)