import {useWindowSize,useWindowWidth,useWindowHeight} from '@react-hook/window-size'
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
import { useState,useEffect } from 'react';
 
import MessageList from '../components/chat/MessageList.jsx';
function Chat(){
    const windowWidth = useWindowWidth();
    const [hasResetSidebar, setHasResetSidebar] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const jsonMessages = [
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

    return(
        //This is a temporary presentation of what we can do for our layout see the real thing below with some components (Update as required)

        //Full container
        <div className="flex h-full w-full relative">
        {/*Leftmost Sidebar (For tab switching) : Never changes */}
        <div className="h-full bg-red-500 w-[80px]">
        {!sidebarVisible ?
        <button className="lg:hidden mt-2 p-0 ms-auto border-2 border-white bg-transparent w-[60px] h-[60px]" onClick={(e) => setSidebarVisible(true)}><BsArrowBarRight className="w-[30px] h-[30px]" /></button>
        :<></>}
        </div>

        {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
        <div className="flex flex-1 relative">
            {sidebarVisible ? 
            <div className={`flex h-full bg-orange-200 sm:max-lg:fixed sm:flex:1 sm:w-[300px] w-full`}> 
                <button className="lg:hidden mt-2 mr-2 ml-auto p-0 border-2 border-white bg-transparent w-[60px] h-[60px]" onClick={(e) => setSidebarVisible(false)}><BsArrowBarLeft className="w-[30px] h-[30px]"/></button>
            </div>
            :<></>}
            
            {/*Main Chat Area*/}
            <div className={`${!sidebarVisible ? "block" : "hidden sm:block" } flex flex-col flex-1 h-full`}>
                <div className="bg-blue-200 w-full h-[100px]">Hi</div>
                <div className="flex flex-col bg-green-200 flex-1 h-full w-full px-4">
                    <MessageList messages = {jsonMessages} userID = {userID}/>
                </div>
            </div>
        </div>  
    </div>
    )
}

export default Chat;