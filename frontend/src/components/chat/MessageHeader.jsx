import ProfileCard from "../accounts/ProfileCard";
import { useState } from "react";
import MemberDropdown from "./MemberDropdown.jsx";
import { useFloating, offset, flip, shift,limitShift,useDismiss,autoUpdate } from "@floating-ui/react";
import AddMemberModal from "../chat/AddMemberModal";
import RemoveMemberModal from "../chat/RemoveMemberModal";
import RenameModal from "../chat/RenameModal";
import LeaveModal from "../chat/LeaveModal";
import axios from "axios";
// components/chat/core/Header.jsx
export default function Header({ name, selectedID, mode, userID, refresh }) {
    // You can customize this logic however you want
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
                console.log("Self Removal (Terminate): ",target.id)
            }
            else{
                try {
                    const accessToken = localStorage.getItem('accessToken');

                    const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}
                    const body    = { group: selectedID, target:target.id};
                    const response = await axios.delete('/api/chat/group_messages/removeMember', { headers:headers, data: body });
                    if (response?.data?.success) {
                        setMode("group_messages")
                        setSelectedID(response?.data?.id)
                        setDropdownVisible(false)
                    }
                } 
                catch (error) {}
            }
        }
    }

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

    return (
        <>
            <div className="bg-orangeFaded w-full h-[60px] flex justify-center items-center px-4 border-b-2 border-blackFaded">
                <div className="flex flex-col text-lg font-semibold">
                    {/*<div>User: {name}</div>*/}
                    <div className="flex items-center self-center gap-2">
                            <button
                                className={`bg-accentOrange hover:bg-orangeHover text-text font-bold px-4 rounded border-blackFaded border-1 ${dropdownVisible?"z-30":""}`}
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                                ref={refs.setReference}
                            >
                                <ProfileCard displayBG={"bg-accentOrange group-hover:bg-orangeHover"} type={""} id={selectedID} status={"offline"}/>
                            </button>
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
                <AddMemberModal open={AddMemberModalOpen} onClose={closeAddMemberModal} refs={refs} floatingStyles={floatingStyles}/>
            )}
            {RenameModalOpen && (
                <RenameModal open={RenameModalOpen} onClose={closeRenameModal} chatID={selectedID} refs={refs} floatingStyles={floatingStyles} chatName={name}/>
            )}
            {LeaveModalOpen && (
                <LeaveModal open={LeaveModalOpen} onClose={closeLeaveModal} leaveFunction={() => handleDelete(selectedMember)} refs={refs} floatingStyles={floatingStyles} chatName={name} isSelf={true}/>
            )}
        </>
    );
}