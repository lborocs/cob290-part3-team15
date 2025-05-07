import { BsFillPersonFill, BsPersonAdd, BsPersonFillAdd, BsX } from "react-icons/bs";
import { IoPricetagsOutline,IoPricetagsSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import {useState,useEffect} from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";

function MemberDropdown({onClose, refs, floatingStyles,mode,selectedID,userID,refresh, openRemoveMemberModal, openAddMemberModal, openRenameModal, openLeaveModal}) {
    const [leader,setLeader] = useState(-1)
    const [items,setItems] = useState([])
    const colors = {
        blue : 'bg-blue-500/60',
        green : 'bg-green-500/60', 
        red : 'bg-red-400/60',
        pink : 'bg-pink-500/40', 
        purple : 'bg-purple-500/40',
        gray : 'bg-gray-500/70',
    }
    
    const colorKeys = Object.keys(colors);
    const colorBasedOnId = selectedID % colorKeys.length;
    const color = colors[colorKeys[colorBasedOnId]];

    const componentsFunctions = [() => console.log("Member 1"), () => console.log("Member 2"), null];
    const icons = [<BsFillPersonFill className="w-6 h-6"/>, <BsFillPersonFill className="w-6 h-6"/>, <BsFillPersonFill className="w-6 h-6"/>]; // Add icons if needed
    const iconColours = ['bg-green-500', 'bg-blue-500', 'bg-red-500'];


    const getPeople = async() => {
        try{
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`/api/chat/${mode}/getMembers?target=${selectedID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
        if (response?.data?.results){
            setItems(response.data.results)
            if(response.data?.owner){
                setLeader(response.data?.owner)
            }
            else{
                setLeader(-1)
            }
        }
        else{
            setMessages([]);
            setLeader(-1)
        }
        }
        catch (error) {
        // Empty as we log errors in the request response
        }
    }

    //Onload
    useEffect(()=>{
        getPeople();
    }, [selectedID,mode,refresh])

    //Refresh
    /*useEffect(()=>{
        getPeople();
    }, [refresh]) */

    return (
        <>
        <div
        className="w-auto absolute bg-backgroundOrange rounded-lg p-2 z-30 border border-accentOrange" {...(refs?.setFloating ? { ref: refs.setFloating } : {})} {...(floatingStyles ? { style: floatingStyles } : {})}>
            <div className="px-1 font-bold text-lg text-left">Members</div>
            {/* Goes through each item in the list and maps items to a key value*/}
            <div className=" w-full max-h-45 overflow-y-auto">
                {items.map((item, index) => {
                    const colorIndex = item.id % colorKeys.length;
                    const itemColor = colors[colorKeys[colorIndex]];
                    return (
                        <div
                        className={`group flex bg-accentOrange items-center w-auto whitespace-nowrap select-none text-lg p-2 px-2 ${leader==item.id?"font-black":"font-bold"} ${mode=="group_messages"&&leader==userID?"cursor-pointer":""} hover:bg-orangeHover rounded-md text-gray-700 mb-1`}
                        key={index} // Add a unique key for each item
                        >
                            {<div className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 outline-1 outline-backgroundOrange shadow-md ${itemColor}`}><FaUser className="w-6 h-6 text-white" /></div>} {/* Check if icon exists before rendering */}
                            <span className="flex-1 text-left">
                                {item.name}
                            </span>
                            {mode=="group_messages"&&leader==userID?
                            leader===item.id?
                            <MdDeleteForever className="invisible w-10 h-10 p-[6px] text-gray-500 ml-2 group-hover:visible" onClick={() => (openLeaveModal(item))} />:
                            <BsX className="invisible w-10 h-10 text-gray-500 ml-2 group-hover:visible" onClick={() => (openRemoveMemberModal(item))} />:<></>}
                        </div>
                    )
                })}
            </div>
            {mode==="group_messages" && leader==userID &&
            <div className="flex justify-evenly mt-4">
                <button
                    className="group w-11 h-11 bg-accentOrange hover:bg-orangeHover rounded-full flex items-center justify-center shadow-md"
                    onClick={() => openRenameModal()}
                >
                    <IoPricetagsOutline className=" w-8 h-8 pr-[2px] pt-[3px] group-hover:hidden"/>
                    <IoPricetagsSharp className="w-8 h-8 pr-[2px] pt-[3px] hidden group-hover:block"/>
                </button>
                <button
                    className="group w-11 h-11 bg-accentOrange hover:bg-orangeHover rounded-full flex items-center justify-center shadow-md"
                    onClick={() => openAddMemberModal()}
                >
                    <BsPersonAdd className=" w-8 h-8 group-hover:hidden"/>
                    <BsPersonFillAdd className="w-8 h-8 hidden group-hover:block"/>
                </button>

            </div>
            }
        </div>

        <div className="fixed inset-0 z-20 pointer-events-auto"></div>
        </>
    );
}

export default MemberDropdown;