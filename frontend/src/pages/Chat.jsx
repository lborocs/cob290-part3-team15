import {useWindowSize,useWindowWidth,useWindowHeight} from '@react-hook/window-size'
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
import { useState,useEffect,useRef } from 'react';
 
import MessageList from '../components/chat/MessageList.jsx';
function Chat(){
    const messageContainerRef = useRef(null);
    const windowWidth = useWindowWidth();
    const [hasResetSidebar, setHasResetSidebar] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const jsonMessages = [
        {user:"1",content:"Body"},
        {user:"2", content:"Body2"},
        {user:"2",content:"Body333333333333333333333333333333"},
        {user:"1",content:"Body"},
        {user:"2", content:"Body2"},
        {user:"2",content:"Body333333333333333333333333333333"},
        {user:"1",content:"Body"},
        {user:"2", content:"Body2"},
        {user:"2",content:"Body333333333333333333333333333333"},
        {user:"1",content:"Body"},
        {user:"2", content:"Body2"},
        {user:"2",content:"Body333333333333333333333333333333"},
        {user:"1",content:"Body"},
        {user:"2", content:"Body2"},
        {user:"2",content:"Body333333333333333333333333333333"},
        {user:"1", content:"Body4"}
    ];
    const userID = 1;

    //On window width resize
    useEffect(() => {
        //If the screen is small and you can reset the sidebar, reset it
        if (windowWidth < 1024 && !hasResetSidebar) {
            setSidebarVisible(true);
            setHasResetSidebar(true);
        } 
        //Reset becomes available if large again
        else if (windowWidth >= 1024 && hasResetSidebar) {
            setHasResetSidebar(false);
            setSidebarVisible(true);
        }
    }, [windowWidth]);

    useEffect(() => {
        // Scroll to bottom on load
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, []);

    return(
        //This is a temporary presentation of what we can do for our layout see the real thing below with some components (Update as required)

        //Full container
        <div className="flex h-screen w-screen relative">
            {/*Leftmost Sidebar (For tab switching) : Never changes */}
            <div className="h-full bg-red-500 w-[80px] z-10">
                <p>Navbar</p>
                {!sidebarVisible ?
                <button className="lg:hidden mt-2 p-0 ms-auto border-2 border-white bg-transparent w-[60px] h-[60px]" onClick={(e) => setSidebarVisible(true)}><BsArrowBarRight className="w-[30px] h-[30px]" /></button>
                :<></>}  
            </div>

            {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
            <div className="flex flex-1 relative">
                {sidebarVisible ? 
                <div className={`flex h-full fixed bg-orange-200 sm:flex:1 sm:w-[300px] w-[calc(100%-80px)] z-10`}> 
                    <button className="lg:hidden mt-2 mr-2 ml-auto p-0 border-2 border-white bg-transparent w-[60px] h-[60px] z-20" onClick={(e) => setSidebarVisible(false)}><BsArrowBarLeft className="w-[30px] h-[30px]"/></button>
                </div>
                :<></>}
                
                {/*Main Chat Area*/}
                <div className={`${!sidebarVisible ? "block" : "hidden sm:block" } flex flex-col flex-1 h-auto relative`}>
                    <div className="bg-blue-200 w-full h-[100px]">Chat</div>
                    <div className="flex flex-col bg-green-200 flex-1 max-h-[calc(100%-100px)] w-full px-4 overflow-y-scroll" ref={messageContainerRef}>
                        <MessageList messages = {jsonMessages} userID = {userID}/>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default Chat;