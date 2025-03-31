// Client socket
import { connectSocket, disconnectSocket,getSocket } from '../socket';

import {useWindowSize,useWindowWidth,useWindowHeight} from '@react-hook/window-size'
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
import { useState,useEffect,useRef } from 'react';
 
import MessageList from '../components/chat/MessageList.jsx';
import MessageBox from '../components/chat/MessageBox.jsx';

import Sidebar from '../components/chat/Sidebar.jsx';
import Navbar from '../components/navigation/Navbar.jsx';
import Auth from "../components/login/Auth.jsx";

function Chat({ user }){
    const messageContainerRef = useRef(null);
    const windowWidth = useWindowWidth();
    const [hasResetSidebar, setHasResetSidebar] = useState(false);

    //Navbar
    const [selectable,setSelectable] = useState(windowWidth<1024);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const activeTab="Chat"

    //Socket
    const [refresh,setRefresh] = useState(0)

    //Communication IDs
    const userID = user.userID;
    const role = user.role;
    const name = user.name;

    //Page specific State (Saves)
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('selectedMode');
        return saved ? saved : 'direct_messages'
    });
    useEffect(() => {
        localStorage.setItem('selectedMode', mode);
    }, [mode]);
    //Selected ID (Saves)
    const [selectedID, setSelectedID] = useState(() => {
        const saved = localStorage.getItem('selectedID');
        return saved ? parseInt(saved) : -1
    });
    useEffect(() => {
        localStorage.setItem('selectedID', selectedID);
    }, [selectedID]);
    

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
        // Scroll to bottom on load
        connectSocket();  // Connect only if on /chat
        const socket = getSocket();
        if (socket){
            socket.emit('setUserId', userID);
            socket.on('newMessage', (data) => {
                setRefresh(previous => previous + 1)
            });
        }
        return () => {
            disconnectSocket(); // Disconnect on unmount
        };
      }, []);


    return(
        //This is a temporary presentation of what we can do for our layout see the real thing below with some components (Update as required)

        //Full container
        <div className="flex h-screen w-screen relative">
            {/*Leftmost Sidebar (For tab switching) : Never changes */}
            <Navbar selectable={selectable} isSelected={sidebarVisible} setIsSelected={setSidebarVisible} activeTab={activeTab}/>

            {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
            <div className="flex flex-1 relative">
                {sidebarVisible ? 
                <div className={`flex flex-col h-full fixed lg:static bg-[#F6CB8F] sm:flex:1 sm:w-[300px] w-[calc(100%-72px)] z-10`}> 
                    {/*<button className="lg:hidden mt-2 mr-2 ml-auto p-0 border-2 border-white bg-transparent w-[60px] h-[60px] z-20" onClick={(e) => setSidebarVisible(false)}><BsArrowBarLeft className="w-[30px] h-[30px]"/></button>*/}
                    <Sidebar userID = {userID} mode={mode} setMode={setMode} selectedID={selectedID} setSelectedID={setSelectedID} refresh={refresh}/>
                </div>
                :<></>}
                
                {/*Main Chat Area*/}
                <div className={`${!sidebarVisible ? "block" : "hidden sm:block" } flex flex-col flex-1 h-auto relative`}>
                    <div className="bg-blue-200 w-full h-[100px]">User:{name} Role:{role}</div>
                    <div className="flex flex-col flex-1 bg-primary h-[calc(100%-100px)]">
                        <div className="flex flex-col flex-1 max-h-full w-full overflow-y-scroll" ref={messageContainerRef}>
                            <MessageList userID = {userID} selectedID={selectedID} mode={mode} refresh={refresh} messageContainerRef={messageContainerRef}/>
                        </div>
                        <div className="flex flex-col bg-primary h-20 justify-center px-4 shadow-md px-30">
                            <MessageBox userID = {userID} selectedID={selectedID} mode={mode}/>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default Auth(Chat)