import ProfileCard from "../accounts/ProfileCard";
import { useState,useEffect } from "react";
import MemberDropdown from "./MemberDropdown.jsx";
import { useFloating, offset, flip, shift,limitShift,useDismiss,autoUpdate } from "@floating-ui/react";
import AddMemberModal from "../chat/AddMemberModal";
import RemoveMemberModal from "../chat/RemoveMemberModal";
import RenameModal from "../chat/RenameModal";
import LeaveModal from "../chat/LeaveModal";
import axios from "axios";
import { FaChevronDown,FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

// components/chat/core/Header.jsx
export default function Header({ selectedID, mode, userID, refresh,setSelectedID,setMode }) {
    // You can customize this logic however you want
    const [name,setName] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [RemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
    const [AddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [RenameModalOpen, setRenameModalOpen] = useState(false);
    const [LeaveModalOpen, setLeaveModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    // Floating UI for dropdown
    const { refs, floatingStyles, context } = useFloating({
        middleware: [
            offset(8),
            flip(),
            shift({
                limiter: limitShift({
                    crossAxis: true,
                    offset: ({ rects, availableWidth }) => {
                        // Only limit shifting to the left (Off screen)
                        return availableWidth < 0 ? 0 : -rects.floating.width;
                    }
                })
            })
        ],
        placement: "bottom-center",
        whileElementsMounted: autoUpdate,
        open: dropdownVisible,
        onOpenChange: setDropdownVisible
    });
    useDismiss(context, {
        outsidePressEvent: "mousedown",
        ignoreElements: [refs.floating], // Ignore the modal
    }); 

    const handleDelete = async (target) => {
        if(mode==="group_messages"){
            if(target.id===userID){
                try{
                    const accessToken = localStorage.getItem('accessToken');
                    const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}
                    const body = {target:selectedID,type:"group_messages",};
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
            else{
                try {
                    const accessToken = localStorage.getItem('accessToken');

                    const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}
                    const body    = { group: selectedID, target:target.id};
                    const response = await axios.delete('/api/chat/group_messages/removeMember', { headers:headers, data: body });
                    if (response?.data?.success) {
                        setDropdownVisible(false)
                    }
                } 
                catch (error) {}
            }
        }
    }

    const getName = async () => {
        try{
            const accessToken = localStorage.getItem('accessToken');
        
            const response = await axios.get(`/api/chat/getName?target=${encodeURIComponent(selectedID)}&type=${encodeURIComponent(mode)}`, {headers: { Authorization: `Bearer ${accessToken}` }});
            if (response?.data?.results){
              setName(response.data.results[0].name);
            } 
            else {
                setName("")
            }
        }
          catch (error) {
            if (error.response?.data?.error === "User is not a member of the group") {
                setSelectedID(-1);
                setMode("direct_messages")
            }
        }
    }

    //Full Refresh handler
      useEffect(()=>{
        getName();
    }, [refresh])

      useEffect(()=>{
        if(selectedID>0)
        getName();
      }, [selectedID,mode])

    const openRemoveMemberModal = (target) => {
        setSelectedMember(target);
        setRemoveMemberModalOpen(true);
        setDropdownVisible(false);
    }

    const closeRemoveMemberModal = () => {
        setRemoveMemberModalOpen(false);
        setSelectedMember(null);
    }

    const openAddMemberModal = () => {
        setAddMemberModalOpen(true);
        setDropdownVisible(false);
    }
    const closeAddMemberModal = () => {
        setAddMemberModalOpen(false);
    }
    const openRenameModal = () => {
        setRenameModalOpen(true);
        setDropdownVisible(false);
    }
    const closeRenameModal = () => {
        setRenameModalOpen(false);
    }
    const openLeaveModal = (target) => {
        setSelectedMember(target);
        setLeaveModalOpen(true);
        setDropdownVisible(false);
    }
    const closeLeaveModal = () => {
        setLeaveModalOpen(false);
        setSelectedMember(null);
    }

    const colors = {
        blue:   "bg-[#4d74b6]", //rgb(0, 57, 150) @ 70%
        green:  "bg-[#64d68e]", // #22c55e @ 70%
        red:    "bg-[#f47c7c]", // #ef4444 @ 70%
        blue2:  "bg-[#74ccfb]", // rgb(0, 170, 255)
        pink:   "bg-[#f27fb8]", // #ec4899 @ 70%
        purple: "bg-[#ae8df9]", // #8b5cf6 @ 70%
        blue3:  "bg-[#6d8cf5]", // rgb(51, 102, 255)
        color3:  "bg-[#ef6f92]", // rgb(255, 0, 76)
        gray:   "bg-[#979ca6]", // #6b7280 @ 70%
        green2: "bg-[#59b64d]", //rgb(111, 224, 101) @ 70%
        indigo: "bg-[#9294f5]", // #6366f1 @ 70%
        teal:   "bg-[#5bcdc1]", // #14b8a6 @ 70%
        pink2: "bg-[#e880aa]", // rgb(255, 162, 199)
        pink3: "bg-[#dc5e91]", // rgb(221, 34, 119)
    }
    
    const colorKeys = Object.keys(colors);
    const colorBasedOnId = selectedID % colorKeys.length;
    const color = colors[colorKeys[colorBasedOnId]];

    return (
        <>
            <div className="bg-orangeFaded w-full h-[60px]  flex justify-center items-center px-4 border-b-2 border-blackFaded focus:outline-none">
                <div className="flex flex-col text-lg font-semibold">
                    {/*<div>User: {name}</div>*/}
                    <div className="flex items-center self-center gap-2">
                            <div
                                className={`relative flex items-center space-x-2 h-[50px] max-w-[250px] sm:max-w-[600px] hover:outline-none rounded-[20px] text-text font-bold px-4 border-blackFaded border-2 ${dropdownVisible?"bg-orangeHover":"bg-accentOrange hover:bg-orangeHover"}`}
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                                ref={refs.setReference}
                            >
                                <span className="sr-only">Toggle members list</span>
                                <div className="h-10 w-10 rounded-full overflow-hidden">
                                    <div className="flex relative w-full h-full group">
                                        {/* Profile Picture */}
                                        <div className={`flex flex-col items-center justify-center w-full h-full rounded-full mx-auto border-4 border-transparent ${color}`}>
                                            {mode === "group_messages" ? <HiUserGroup className="w-6 h-6 mb-[1px] text-white" /> : <FaUser className="w-6 h-6 text-white" />}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-1 truncate select-none">{name}</div>
                                <FaChevronDown
                                    className={`h-5 w-5 text-gray-800 transform transition-transform duration-200 ${
                                        dropdownVisible ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>
                    </div>
                </div>
            </div>
            {dropdownVisible && (
                <MemberDropdown onClose={() => setDropdownVisible(false)} refs={refs} floatingStyles={floatingStyles} mode={mode} selectedID={selectedID} name={name} userID={userID} refresh={refresh} openRemoveMemberModal={openRemoveMemberModal} openAddMemberModal={openAddMemberModal} openRenameModal={openRenameModal} openLeaveModal={openLeaveModal}/>
            )
            }
            {RemoveMemberModalOpen && (
                <RemoveMemberModal open={RemoveMemberModalOpen} onClose={closeRemoveMemberModal} removeFunction={() => handleDelete(selectedMember)} refs={refs} floatingStyles={floatingStyles}/>
            )}
            {AddMemberModalOpen && (
                <AddMemberModal open={AddMemberModalOpen} onClose={closeAddMemberModal} refs={refs} floatingStyles={floatingStyles} selectedID={selectedID}/>
            )}
            {RenameModalOpen && (
                <RenameModal open={RenameModalOpen} onClose={closeRenameModal} chatID={selectedID} refs={refs} floatingStyles={floatingStyles} chatName={name} selectedID={selectedID}/>
            )}
            {LeaveModalOpen && (
                <LeaveModal open={LeaveModalOpen} onClose={closeLeaveModal} leaveFunction={() => handleDelete(selectedMember)} refs={refs} floatingStyles={floatingStyles} chatName={name} isSelf={true}/>
            )}
        </>
    );
}