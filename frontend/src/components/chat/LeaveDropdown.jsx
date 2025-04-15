import React, { useEffect, useRef, useState } from "react";
import { BsBoxArrowLeft } from "react-icons/bs";
import DropdownList from "./DropdownList.jsx"; 
import LeaveModal from "./LeaveModal.jsx";
function LeaveDropdown({onClose, leaveFunction, position}){
    // Hiding / deleting chats modal
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const items = ['Leave Chat'];
    const componentsFunctions = [()=> setShowLeaveModal(true)]; // Function to call when item is clicked
    const icons = [<BsBoxArrowLeft className="text-red-500"/>];
    const dropdownRef = useRef(null); // Reference to the dropdown element
    // Same as chat dropdown, using ref to detect clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the dropdown and not on the modal
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest(".modal-content")) { // Ignore clicks on the modal affecting the dropdown
                onClose(); // Call the onClose function to close the dropdown
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div>
            <div ref={dropdownRef} style={{position: "absolute", top: position.y, left: position.x}}>
                <DropdownList items={items} onClick={componentsFunctions} icons={icons} />
            </div>
            {showLeaveModal && 
                <LeaveModal open={showLeaveModal} onClose={() => setShowLeaveModal(false)} leaveFunction={leaveFunction} closeDropdown={onClose} />
            }
        </div>
    );
}

export default LeaveDropdown;