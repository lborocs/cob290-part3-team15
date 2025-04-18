import DropdownList from "../chat/DropdownList";
import { useEffect, useRef } from "react";
function statusDropdown({onClose, refs, floatingStyles}) {
    console.log(onClose)
    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Close dropdown when clicking outside
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickOnButton = refs.reference.current && refs.reference.current.contains(event.target);
            const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);

            if (!isClickOnButton && !isClickInsideDropdown) {
                // Close dropdown when clicking outside
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, refs]);

    const handleOnline = () => {
        console.log('Online clicked'); // Placeholder for online status action
        onClose();
    }

    const handleInvisible = () => {
        console.log('Invisible clicked'); // Placeholder for invisible status action
        onClose();
    }

    const items = ['Online', 'Invisible'];

    const componentsFunctions = [handleOnline, handleInvisible]

    const icons = [
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-green-400`}></div>,
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-gray-400`}></div>
    ]

    return(
        <div ref = {dropdownRef} className="absolute" onClick={(e) => e.stopPropagation()} style={{position: "absolute", top: floatingStyles.y, left: floatingStyles.x}}>
            <DropdownList items={items} onClick={componentsFunctions} icons={icons} refs={refs} floatingStyles={floatingStyles}/>
        </div>
    )
}

export default statusDropdown;