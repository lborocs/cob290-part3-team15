import {useWindowSize,useWindowWidth,useWindowHeight} from '@react-hook/window-size'
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
import { useState,useEffect } from 'react';

function Chat(){
    const windowWidth = useWindowWidth();
    const [hasResetSidebar, setHasResetSidebar] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    //On window width resize
    useEffect(() => {
        //If the screen is small and you can reset the sidebar, reset it
        if (windowWidth < 768 && !hasResetSidebar) {
            setSidebarVisible(true);
            setHasResetSidebar(true);
        } 
        //Reset becomes available if large again
        else if (windowWidth >= 768 && hasResetSidebar) {
            setHasResetSidebar(false);
            setSidebarVisible(true);
        }
    }, [windowWidth]);

    return(
        //This is a temporary presentation of what we can do for our layout see the real thing below with some components (Update as required)

        //Full container
        <div className="d-flex vh-100 vw-100 position-relative">
        {/*Leftmost Sidebar (For tab switching) : Never changes */}
        <div className="vh-100 bg-danger" style={{ width: "80px" }}>
        {windowWidth<768 && !sidebarVisible ?
        <button className="mt-2 p-0 ms-auto border border-2 border-white bg-transparent" onClick={(e) => setSidebarVisible(true)} style={{ width: "60px", height: "60px" }}><BsArrowBarRight style={{ width: "30px", height: "30px" }} /></button>
        :<></>}
        </div>

        {/*Sidebar for unique tab interactions e.g. Users to direct message : Shrinks and then completely disappears below a threshold to be a on click*/}
        <div className="d-flex position-relative flex-grow-1">
            {sidebarVisible ? 
            <div className={`d-flex vh-100 bg-warning sidebar-scaling ${windowWidth<576 ? "" : "flex-grow-0"}`} style={{ width: windowWidth<576? "100%": "300px" }}>
                {windowWidth<768 ? 
                <button className="mt-2 me-2 p-0 ms-auto border border-2 border-white bg-transparent" onClick={(e) => setSidebarVisible(false)} style={{ width: "60px", height: "60px" }}><BsArrowBarLeft style={{ width: "30px", height: "30px" }} /></button>
                :<></>}
            </div>
            :<></>}
            
            {windowWidth>=576 || !sidebarVisible ?
            <div className="d-flex flex-column flex-grow-1 vh-100">
                <div className="blue" style={{ width: "100%", height:"100px" }}>Hi</div>
                <div className="green flex-grow-1" style={{ width: "100%" }}></div>
            </div>
            :<></>}
        </div>  
    </div>

    // Stuff to actually use, the above is pre components just to visually see
    /*
    <div className="d-flex vh-100 vw-100 position-relative">
        <div className="vh-100 bg-danger " style={{ width: "80px" }}></div>
        <div className="d-flex position-relative flex-grow-1">
            <Sidebar type=?/>
            <Chat />
        </div>
    </div>
    */
    )
}

export default Chat;